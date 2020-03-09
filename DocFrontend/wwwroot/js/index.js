var components = [];
var logincomponents = [];

var loginForm = Ext.create("DocsManager.Login", {
    //hidden:true
});
logincomponents.push(loginForm);

var startMenu = Ext.create("DocsManager.StartMenu", {
    title: 'Benvenuto ' + S_USER_NAME + '!',
    listeners: {
        afterrender: function (obj) {
            if (S_USER_ROLE !== "Administrator") {
                Ext.getCmp("btnUsers").setHidden(true);
            }
        }
    }
});
components.push(startMenu);
