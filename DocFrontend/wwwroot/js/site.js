Ext.onReady(function () {
    function taskNotifier () {
        var url = './api/document/notifcount/';
        Ext.Ajax.request({
            url: url,
            success: function(response, opts) {
                var number = Ext.decode(response.responseText);
                Ext.getCmp("btnNotifies").setBadgeNumber(number);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    }

    var task = {
        run: taskNotifier,
        interval: 10000 
    }
    
    var runner = new Ext.util.TaskRunner();

    if (S_USER_ROLE !== "Administrator") {
        document.getElementById("divNotifies").style.display = 'none';
    }

    Ext.create("Ext.button.Button", {
        id: 'btnNotifies',
        cls: 'btn-notifies',
        iconCls: 'icon-notification',
        iconAlign: 'bottom',
        text: '',
        renderTo: 'divNotifies',
        setBadgeNumber: function (number) {
            var btn = this;
            btn.setText(number !== 0 ? '<span style="background-color: #f00;right: 10px;position: absolute;padding: 3px;border-radius: 4px;">' + number + '</span>' : '');
        },
        listeners: {
            afterrender: function (btn) {
                taskNotifier(); // first time
                if (S_USER_ROLE === "Administrator")
                    runner.start(task);
            },
            click: function (btn) {
                Ext.create('Ext.window.Window', {
                    title : "Notifiche",
                    width : 400,
                    height: 450,
                    maximizable: true,
                    modal: true,
                    closeAction: 'destroy',
                    constrain: true,
                    style: 'padding: 10px;',
                    items : [],
                    autoScroll: true,
                    listeners: {
                        afterrender: function (win) {
                            var url = './api/document/notification/';
                            Ext.Ajax.request({
                                url: url,
                                success: function(response, opts) {
                                    var notifs = Ext.decode(response.responseText);
                                    var notifIds = "";
                                    
                                    if(notifs.length == 0) {
                                        win.add(
                                            {
                                                xtype : "component",
                                                html: "<h5>0 notifiche</h5><p style='padding: 10px;'>Tutte le notifiche sono state visualizzate.</p>"
                                            }
                                        );
                                        return;
                                    }

                                    for (var i = 0; i < notifs.length; i++) {
                                        var notif = notifs[i];
                                        notifIds += notif.notificationID + ",";
                                        win.add(
                                            {
                                                xtype : "component",
                                                html: "<h5>" + notif.title + "</h5><p style='padding: 10px;'>" + notif.description + "</p>"
                                            }
                                        );
                                    }
                                    notifIds = notifIds.substring(0, notifIds.length - 1);

                                    Ext.Ajax.request({
                                        url: './api/document/notification/' + notifIds,
                                        method: 'PUT',
                                        headers: { 
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json' 
                                        },                                   
                                        success: function(result, action, response) {
                                            taskNotifier();
                                        },                                   
                                        scope: this 
                                    });
                                },
                                failure: function(response, opts) {
                                    console.log('server-side failure with status code ' + response.status);
                                }
                            });
                        }
                    }
                }).show();
            }
        }
    });

    Ext.create('Ext.panel.Panel', {
        id: 'ExtMainPanel',
        renderTo: 'ext-panel',
        items: components
    });

    if(typeof logincomponents !== 'undefined') {
        Ext.create('Ext.panel.Panel', {
            id: 'ExtLoginPanel',
            renderTo: 'ext-login',
            items: logincomponents
        });
    }
});