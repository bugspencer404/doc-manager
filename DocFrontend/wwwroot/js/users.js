var components = [];

function refreshUsers (grid) {
    Ext.Ajax.request({
        url: './api/user',
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
        title: 'Inserisci utente',
        closeAction: 'destroy',
        constrain: true,
        items: [
            Ext.create('DocManager.form.User', {
                buttons: [{
                    text: 'Inserisci',
                    disabled: true,
                    formBind: true, 
                    listeners: {
                        click: function (btn) {
                            var s = docsGrid.getStore();
                            var rows = s.getData().items;
                            var index = 0;
                            if (rows.length > 0) {
                                var lastrow = rows[rows.length - 1];
                                index = lastrow.data.userID + 1;
                            }

                            Ext.Ajax.request({
                                url: './api/user/',
                                method: 'POST',
                                headers: { 
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json' 
                                },
                                params: JSON.stringify({
                                    UserID: index,
                                    UserName: Ext.getCmp("idUsername").getValue(),
                                    Password: Ext.getCmp("idPassword").getValue(),
                                    Email: Ext.getCmp("idEmail").getValue(),
                                    Deleted: false,
                                    RoleID: 2
                                }),                                   
                                success: function(result, action, response) {
                                    refreshUsers(docsGrid);
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

Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'userID',  type: 'int'},
        {name: 'userName', type: 'string'},
        {name: 'password', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'deleted', type: 'boolean'},
        {name: 'roleName', type: 'string'}
    ]
});

var userStore = Ext.create('Ext.data.Store', {
    model: 'User',
    data: []
});

var docsGrid = Ext.create("DocsManager.Grid", {
    store: userStore,
    storeId: 'mystore',
    title: 'Elenco utenti',
    columns: [
        {
            text: 'Username',
            width: 200,
            sortable: true,
            hideable: false,
            dataIndex: 'userName'
        }, 
        {
            text: 'Email',
            width: 250,
            dataIndex: 'email'
        }, 
        {
            text: 'Ruolo',
            flex: 1,
            dataIndex: 'roleName'
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
                        title: 'Modifica utente',
                        closeAction: 'destroy',
                        constrain: true,
                        items: [
                            Ext.create('DocManager.form.User', {
                                buttons: [{
                                    text: 'Modifica',
                                    disabled: true,
                                    formBind: true, 
                                    listeners: {
                                        click: function (btn) {
                                            Ext.Ajax.request({
                                                url: './api/user/' + record.data.userID,
                                                method: 'PUT',
                                                headers: { 
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json' 
                                                },
                                                params: JSON.stringify({
                                                    UserID: record.data.userID,
                                                    UserName: Ext.getCmp("idUsername").getValue(),
                                                    Password: Ext.getCmp("idPassword").getValue(),
                                                    Email: Ext.getCmp("idEmail").getValue(),
                                                    Deleted: false,
                                                    RoleID: (record.data.roleName === 'Operator' ? 2 : 1)
                                                }),                                   
                                                success: function(result, action, response) {
                                                    refreshUsers(docsGrid);
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
                                        var Username = userInfo.items.items[0];
                                        var Email = userInfo.items.items[1];
                                        var Password = userInfo.items.items[2];
                                        var Verify = userInfo.items.items[3];
                                        Username.setValue(record.data.userName);
                                        Email.setValue(record.data.email);
                                        Password.setValue(record.data.password);
                                        Verify.setValue(record.data.password);
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
                        url: './api/user/' + record.data.userID,
                        method: 'DELETE',
                        success: function(response, opts) {
                            refreshUsers(docsGrid);
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
            refreshUsers(grid);
        },
        itemdblclick: function(grid, rowIndex, columnIndex, e) {
            var shows = Ext.create('Ext.data.Store', {
                fields: ['id','description'],
                data: []
            });

            var winProjs = Ext.create('Ext.window.Window', {
                title : "Seleziona i progetti per " + rowIndex.data.userName,
                id: 'winUsProj',
                width : 500,
                height: 180,
                modal: true,
                closeAction: 'destroy',
                constrain: true,
                items : [
                    {
                        xtype: 'tagfield',
                        id: 'tagProjects',
                        fieldLabel: 'Seleziona i progetti',
                        store: shows,
                        style: 'margin: 10px;',
                        displayField: 'description',
                        valueField: 'id',
                        queryMode: 'local',
                        filterPickList: true,
                        width: 300,
                        maxWidth: 500,
                        maxHeight: 10,
                        listeners: {
                            afterrender: function (comp) {
                                Ext.Ajax.request({
                                    url: './api/project/tags',
                                    success: function(response, opts) {
                                        var obj = Ext.decode(response.responseText);
                                        shows.setData(obj);

                                        Ext.Ajax.request({
                                            url: './api/project/tags/' + rowIndex.data.userID,
                                            success: function(response, opts) {
                                                var obj = Ext.decode(response.responseText);
                                                for (var i = 0; i < obj.length; i++) {
                                                    Ext.getCmp('tagProjects').select(obj);
                                                }
                                            },
                                            failure: function(response, opts) {
                                                console.log('server-side failure with status code ' + response.status);
                                            }
                                        });
                                    },
                                    failure: function(response, opts) {
                                        console.log('server-side failure with status code ' + response.status);
                                    }
                                });
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        text: 'Seleziona',
                        handler: function (btn) {
                            var projects = Ext.getCmp('tagProjects').getValue();
                            var sproj = projects.join(',');

                            if (sproj === "") {
                                sproj = "nothing";
                            }

                            Ext.Ajax.request({
                                url: './api/project/tags/' + rowIndex.data.userID + '/' + sproj,
                                method: 'POST',
                                headers: { 
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json' 
                                },
                                success: function(result, action, response) {
                                    Ext.getCmp("winUsProj").close();
                                },                                   
                                scope: this 
                            });
                        }
                    }
                ]
            });

            if(rowIndex.data.roleName !== 'Administrator')
                winProjs.show();
        }
    }
});

components.push(docsGrid);