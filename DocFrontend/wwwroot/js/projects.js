var components = [];

function refresh (grid) {
    var url = './api/project/';
    
    var urlParams = new URLSearchParams(window.location.search);
    var custID = (urlParams.get('cId') != null ? parseInt(urlParams.get('cId')) : 1);
    url += custID;

    Ext.Ajax.request({
        url: url,
        success: function(response, opts) {
            var obj = Ext.decode(response.responseText);
            grid.getStore().setData(obj);
        },
        failure: function(response, opts) {
            console.log('server-side failure with status code ' + response.status);
        }
    });
}

function onItemAdd (grid) {
    Ext.create('Ext.window.Window', {
        id: 'add-window',
        modal: true,
        title: 'Inserisci progetto',
        closeAction: 'destroy',
        constrain: true,
        items: [
            Ext.create('DocManager.form.Projects', {
                buttons: [{
                    text: 'Inserisci',
                    disabled: true,
                    formBind: true, 
                    listeners: {
                        click: function (btn) {
                            
                            var urlParams = new URLSearchParams(window.location.search);
                            var custID = (urlParams.get('cId') != null ? parseInt(urlParams.get('cId')) : 1);
                            Ext.Ajax.request({
                                url: './api/project/',
                                method: 'POST',
                                headers: { 
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json' 
                                },
                                params: JSON.stringify({
                                    ProjectID: -1,
                                    Name: Ext.getCmp("idName").getValue(),
                                    Description: Ext.getCmp("idDescription").getValue(),
                                    CustomerID: custID
                                }),
                                success: function(result, action, response) {
                                    refresh(docsGrid);
                                    Ext.getCmp("add-window").close();
                                },
                                scope: this 
                            });
                                
                        }
                    }
                }]
            })
        ]
    }).show();
}

Ext.define('Project', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'projectID',  type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'customerName', type: 'string'}
    ]
});

var store = Ext.create('Ext.data.Store', {
    model: 'Project',
    data: []
});

var docsGrid = Ext.create("DocsManager.Grid", {
    store: store,
    storeId: 'mystore',
    title: 'Elenco progetti',
    columns: [
        {
            text: 'Nome',
            flex: 1,
            sortable: true,
            hideable: false,
            dataIndex: 'name'
        },
        {
            text: 'Descrizione',
            flex: 1,
            sortable: true,
            hideable: false,
            dataIndex: 'description'
        },
        {
            text: 'Cliente',
            flex: 1,
            sortable: true,
            hideable: false,
            dataIndex: 'customerName'
        },
        {
            xtype: 'actioncolumn',
            hideable: false,
            width: 30,
            sortable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'icon-edit',
                tooltip: 'Modifica',
                handler: function(view, recIndex, cellIndex, item, e, record) {
                    Ext.create('Ext.window.Window', {
                        id: 'edit-window',
                        modal: true,
                        title: 'Modifica progetto',
                        closeAction: 'destroy',
                        constrain: true,
                        items: [
                            Ext.create('DocManager.form.Projects', {
                                buttons: [{
                                    text: 'Modifica',
                                    disabled: true,
                                    formBind: true, 
                                    listeners: {
                                        click: function (btn) {
                                            var urlParams = new URLSearchParams(window.location.search);
                                            var custID = (urlParams.get('cId') != null ? parseInt(urlParams.get('cId')) : 1);
                                            Ext.Ajax.request({
                                                url: './api/project/' + record.data.projectID,
                                                method: 'PUT',
                                                headers: { 
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json' 
                                                },
                                                params: JSON.stringify({
                                                    ProjectID: record.data.projectID,
                                                    Name: Ext.getCmp("idName").getValue(),
                                                    Description: Ext.getCmp("idDescription").getValue(),
                                                    CustomerID: custID
                                                }),                                   
                                                success: function(result, action, response) {
                                                    refresh(docsGrid);
                                                    Ext.getCmp("edit-window").close();
                                                },                                   
                                                scope: this 
                                            });
                                                
                                        }
                                    }
                                }],
                                listeners: {
                                    afterrender: function (cmp) {
                                        var userInfo = cmp.items.items[0];
                                        var Name = userInfo.items.items[0];
                                        var Description = userInfo.items.items[1];
                                        Name.setValue(record.data.name);
                                        Description.setValue(record.data.description);
                                    }
                                }
                            })
                        ]
                    }).show();
                }
            }]
        }, 
        {
            xtype: 'actioncolumn',
            hideable: false,
            width: 30,
            sortable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'icon-delete',
                tooltip: 'Cancella',
                handler: function(view, recIndex, cellIndex, item, e, record) {
                    Ext.Ajax.request({
                        url: './api/project/' + record.data.projectID,
                        method: 'DELETE',
                        success: function(response, opts) {
                            refresh(docsGrid);
                        },
                        failure: function(response, opts) {
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });
                }
            }]
        }
    ],
    listeners: {
        afterrender: function (grid, e) {
            refresh(grid);
            if (S_USER_ROLE !== "Administrator") {
                disableAdminTools(grid.getColumns(), 2);
            }
        },
        itemdblclick: function(grid, rowIndex, columnIndex, e) {
            var pId = rowIndex.data.projectID;
            location.href = './documents?pId=' + pId;
        }
    }
});

components.push(docsGrid);