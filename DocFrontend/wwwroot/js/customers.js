var components = [];

function refresh (grid) {
    var url = './api/customer';
    
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
        title: 'Inserisci cliente',
        closeAction: 'destroy',
        constrain: true,
        items: [
            Ext.create('DocManager.form.Customers', {
                buttons: [{
                    text: 'Inserisci',
                    disabled: true,
                    formBind: true, 
                    listeners: {
                        click: function (btn) {
                            Ext.Ajax.request({
                                url: './api/customer/',
                                method: 'POST',
                                headers: { 
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json' 
                                },
                                params: JSON.stringify({
                                    CustomerID: -1,
                                    CustomerName: Ext.getCmp("idName").getValue(),
                                    Description: Ext.getCmp("idDescription").getValue()
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

Ext.define('Customer', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'customerID',  type: 'int'},
        {name: 'customerName', type: 'string'},
        {name: 'description', type: 'string'}
    ]
});

var store = Ext.create('Ext.data.Store', {
    model: 'Customer',
    data: []
});

var docsGrid = Ext.create("DocsManager.Grid", {
    store: store,
    storeId: 'mystore',
    title: 'Elenco clienti',
    columns: [
        {
            text: 'Nome',
            flex: 1,
            sortable: true,
            hideable: false,
            dataIndex: 'customerName'
        },
        {
            text: 'Descrizione',
            flex: 1,
            sortable: true,
            hideable: false,
            dataIndex: 'description'
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
                        title: 'Modifica cliente',
                        closeAction: 'destroy',
                        constrain: true,
                        items: [
                            Ext.create('DocManager.form.Customers', {
                                buttons: [{
                                    text: 'Modifica',
                                    disabled: true,
                                    formBind: true, 
                                    listeners: {
                                        click: function (btn) {
                                            Ext.Ajax.request({
                                                url: './api/customer/' + record.data.customerID,
                                                method: 'PUT',
                                                headers: { 
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json' 
                                                },
                                                params: JSON.stringify({
                                                    CustomerID: record.data.customerID,
                                                    CustomerName: Ext.getCmp("idName").getValue(),
                                                    Description: Ext.getCmp("idDescription").getValue()
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
                                        Name.setValue(record.data.customerName);
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
                        url: './api/customer/' + record.data.customerID,
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
            var custId = rowIndex.data.customerID;
            location.href = './projects?cId=' + custId;
        }
    }
});

components.push(docsGrid);