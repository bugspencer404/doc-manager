Ext.define('DocsManager.MenuController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.start-menu',

    onUsers: function () {
        location.href = './users';
        //Ext.Msg.alert('Success', 'You clicked on Users!');
    },
    onCustomers: function () {
        location.href = './customers';
        //Ext.Msg.alert('Success', 'You clicked on Customers!');
    },
    onExit: function () {
        Ext.Ajax.request({
            url: './api/user/logout',
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            success: function(result, action, response) {
                if (result.status == 200) {
                    location.href = './';
                }
                else {
                    Ext.Msg.alert('Logout Failure', '');
                }
                
            },                                   
            scope: this 
        });
    }
});

Ext.define('DocsManager.StartMenu', {
    extend: 'Ext.panel.Panel',
    xtype: 'start-menu',
    controller: 'start-menu',
    title: 'Welcome',
    cls: 'login-class',

    bodyPadding: 20,
    width: 1000,
    autoSize: true,
    tbar: { 
        xtype: 'toolbar', 
        buttonAlign:'center', 
        dock: 'top', 
        items: [
            {
                xtype: 'button',
                iconCls: 'app-users',
                id: 'btnUsers',
                text: 'Utenti',
                scale: 'large',
                iconAlign: 'top',
                handler: 'onUsers'
            },
            {
                xtype: 'button',
                iconCls: 'app-customers',
                text: 'Gestione documenti',
                scale: 'large',
                iconAlign: 'top',
                handler: 'onCustomers'
            },
            {
                xtype: 'button',
                iconCls: 'app-exit',
                text: 'Esci',
                scale: 'large',
                iconAlign: 'top',
                handler: 'onExit'
            }
        ]
    }
});