Ext.define('DocsManager.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-login',

    onLogin: function () {
        var form = this.getView().getForm();
        if (form.isValid()) {

            Ext.Ajax.request({
                url: './api/user/login',
                method: 'POST',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                params: JSON.stringify({
                    Email: Ext.getCmp("idEmail").getValue(),
                    Password: Ext.getCmp("idPassword").getValue()
                }),                                   
                success: function(result, action, response) {
                    if (result.status == 200) {
                        location.href = './';
                    }
                    else {
                        Ext.Msg.alert('Login Failure', 'The username/password provided is invalid.');
                    }
                    
                },                                   
                scope: this 
            });

            //Ext.Msg.alert('Login Success', 'You have been logged in!');
        } else {
            Ext.Msg.alert('Login fallito', 'username/password non validi.');
        }
    }
});

Ext.define('DocsManager.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'login',
    controller: 'form-login',
    title: 'Login',
    cls: 'login-class',

    bodyPadding: 20,
    width: 320,
    autoSize: true,

    items: [
        {
            xtype: 'textfield',
            allowBlank: false,
            required: true,
            id: 'idEmail',
            fieldLabel: 'Email',
            vtype: 'email',
            name: 'user',
            cls: 'login-field',
            placeholder: 'User Email'
        }, 
        {
            xtype: 'textfield',
            inputType:'password',
            allowBlank: false,
            cls: 'login-field',
            required: true,
            id: 'idPassword',
            fieldLabel: 'Password',
            name: 'pass',
            placeholder: 'Password'
        },
        {
            xtype: 'button',
            cls: 'login-field',
            text: 'Accedi',
            handler: 'onLogin'
        }
    ]
});