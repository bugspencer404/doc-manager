var components = [];

function refresh (grid) {
    var url = './api/document/';
    
    var urlParams = new URLSearchParams(window.location.search);
    var custID = (urlParams.get('pId') != null ? parseInt(urlParams.get('pId')) : 1);
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
        title: 'Inserisci documento',
        closeAction: 'destroy',
        constrain: true,
        items: [
            Ext.create('DocManager.form.Documents', {
                id: 'idDocInsert',
                buttons: [{
                    text: 'Inserisci',
                    disabled: true,
                    formBind: true, 
                    listeners: {
                        click: function (btn) {
                            var form = Ext.getCmp('idDocInsert');
                            if (form.isValid()) {
                                var urlParams = new URLSearchParams(window.location.search);
                                var projID = (urlParams.get('pId') != null ? parseInt(urlParams.get('pId')) : 1);
                                form.submit({
                                    url: './api/document/' + projID,
                                    waitMsg: 'Caricamento in corso...',
                                    success: function (fp, o) {
                                        console.log("success");
                                        Ext.getCmp('add-window').close();
                                        refresh(docsGrid);
                                    },
                                    failure: function (fp, o) {
                                        Ext.getCmp('add-window').close();
                                        refresh(docsGrid);
                                    }
                                });
                            }
                                
                        }
                    }
                }]
            })
        ]
    }).show();
}

Ext.define('Document', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'documentID',  type: 'int'},
        {name: 'title',  type: 'string'},
        {name: 'fileName', type: 'string'},
        {name: 'approved', type: 'int'},
        {name: 'projectName', type: 'string'}
    ]
});

var store = Ext.create('Ext.data.Store', {
    model: 'Document',
    data: []
});

var docsGrid = Ext.create("DocsManager.Grid", {
    store: store,
    storeId: 'mystore',
    title: 'Elenco documenti',
    columns: [
        {
            text: 'Titolo',
            flex: 1,
            sortable: true,
            hideable: false,
            dataIndex: 'title'
        },
        {
            text: 'Progetto',
            flex: 1,
            sortable: true,
            hideable: false,
            dataIndex: 'projectName'
        },
        {
            text: 'Approvato',
            width: 90,
            sortable: true,
            hideable: false,
            dataIndex: 'approved',
            renderer: function (val) {
                return val > 0 ? "<img src='./img/icons/check.png' alt='approvato' width='12px' height='12px' />" : (val < 0 ? "<img src='./img/icons/quit.png' alt='approvato' width='12px' height='12px' />" : "");
            }
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
                            Ext.create('DocManager.form.Documents', {
                                items: [{
                                    xtype: 'fieldset',
                                    title: 'Info',
                                    defaultType: 'textfield',
                                    defaults: {
                                        anchor: '100%'
                                    },
                            
                                    items: [
                                        { allowBlank: false, id: 'idTitle', fieldLabel: 'Titolo', name: 'title', emptyText: 'titolo documento' }
                                    ]
                                }],
                                buttons: [{
                                    text: 'Modifica',
                                    disabled: true,
                                    formBind: true,
                                    listeners: {
                                        click: function (btn) {
                                            var urlParams = new URLSearchParams(window.location.search);
                                            var custID = (urlParams.get('pId') != null ? parseInt(urlParams.get('pId')) : 1);
                                            Ext.Ajax.request({
                                                url: './api/document/' + record.data.documentID,
                                                method: 'PUT',
                                                headers: { 
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json' 
                                                },
                                                params: JSON.stringify({
                                                    DocumentID: record.data.documentID,
                                                    Title: Ext.getCmp("idTitle").getValue(),
                                                    FileName: record.data.fileName,
                                                    Approved: record.data.approved,
                                                    ProjectID: custID
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
                                        var Title = userInfo.items.items[0];
                                        Title.setValue(record.data.title);
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
                        url: './api/document/' + record.data.documentID,
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
        }, 
        {
            xtype: 'actioncolumn',
            name: 'approvalcolumn',
            hideable: false,
            width: 30,
            sortable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'icon-approval',
                tooltip: 'Approva',
                handler: function(view, recIndex, cellIndex, item, e, record) {
                    Ext.create('Ext.window.Window', {
                        id: 'approvalWindow',
                        title : "Approvazione del documento: [" + record.data.title + "]",
                        width : 500,
                        height: 300,
                        modal: true,
                        closeAction: 'destroy',
                        constrain: true,
                        style: 'text-align: center;',
                        items : [
                            {
                                xtype : "component",
                                style: "margin: 10px;",
                                html: "<h5>Vuoi approvare o rifiutare?</h5><img src='./img/icons/decision.png' />"
                            },
                            {
                                xtype : "button",
                                iconCls: 'icon-dislike',
                                text: 'Rifiuta',
                                scale: 'large',
                                iconAlign: 'top',
                                style: "margin: 4px;",
                                handler: function () {
                                    var urlParams = new URLSearchParams(window.location.search);
                                    var custID = (urlParams.get('pId') != null ? parseInt(urlParams.get('pId')) : 1);
                                    Ext.Ajax.request({
                                        url: './api/document/' + record.data.documentID,
                                        method: 'PUT',
                                        headers: { 
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json' 
                                        },
                                        params: JSON.stringify({
                                            DocumentID: record.data.documentID,
                                            Title: record.data.title,
                                            FileName: record.data.fileName,
                                            Approved: -1,
                                            ProjectID: custID
                                        }),                                   
                                        success: function(result, action, response) {
                                            var obj = Ext.decode(action.params);
                                            refresh(docsGrid);
                                            sendNotification("Documento non valido", "Il documento " + obj.Title + " non è stato approvato.");
                                            Ext.getCmp("approvalWindow").close();
                                        },                                   
                                        scope: this 
                                    });
                                }
                            },
                            {
                                xtype : "button",
                                iconCls: 'icon-like',
                                text: 'Approva',
                                scale: 'large',
                                iconAlign: 'top',
                                style: "margin: 4px;",
                                handler: function () {
                                    var urlParams = new URLSearchParams(window.location.search);
                                    var custID = (urlParams.get('pId') != null ? parseInt(urlParams.get('pId')) : 1);
                                    Ext.Ajax.request({
                                        url: './api/document/' + record.data.documentID,
                                        method: 'PUT',
                                        headers: { 
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json' 
                                        },
                                        params: JSON.stringify({
                                            DocumentID: record.data.documentID,
                                            Title: record.data.title,
                                            FileName: record.data.fileName,
                                            Approved: 1,
                                            ProjectID: custID
                                        }),                                   
                                        success: function(result, action, response) {
                                            var obj = Ext.decode(action.params);
                                            refresh(docsGrid);
                                            sendNotification("Documento approvato", "Il documento " + obj.Title + " è stato approvato.");
                                            Ext.getCmp("approvalWindow").close();
                                        },                                   
                                        scope: this 
                                    });
                                }
                            }
                        ]
                    }).show();
                }
            }]
        }
    ],
    listeners: {
        afterrender: function (grid, e) {
            refresh(grid);
            if (S_USER_ROLE !== "Administrator") {
                disableAdminTools(grid.getColumns(), 3);
            }
            else {
                disableOperatorTools(grid.getColumns(), 3);
            }
        },
        itemdblclick: function(grid, rowIndex, columnIndex, e) {
            Ext.create('Ext.window.Window', {
                title : rowIndex.data.title,
                width : 700,
                height: 450,
                maximizable: true,
                modal: true,
                closeAction: 'destroy',
                constrain: true,
                layout : 'fit',
                items : [{
                    xtype : "component",
                    autoEl : {
                        tag : "iframe",
                        src : rowIndex.data.fileName
                    }
                }]
            }).show();
        }
    }
});

function sendNotification (title, description) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let dateoutput = month  + '\n'+ day  + ',' + year;

    Ext.Ajax.request({
        url: './api/document/notification',
        method: 'POST',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        params: JSON.stringify({
            NotificationID: -1,
            Title: title,
            Description: "[" + dateoutput + "] " + description,
            Acknowledged: 0
        }),
        success: function(result, action, response) {
            console.log("Notified");
        },
        scope: this 
    });
}

components.push(docsGrid);