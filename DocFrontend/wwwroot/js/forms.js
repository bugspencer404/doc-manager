Ext.define('DocManager.form.User', {
    extend: 'Ext.form.Panel',
    xtype: 'add-user',
    frame: true,
    bodyPadding: 10,
    scrollable: true,
    width: 355,
    fieldDefaults: {
        labelAlign: "right",
        labelWidth: 80,
        msgTarget: 'side'
    },

    items: [{
        xtype: 'fieldset',
        title: 'Info',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [
            { allowBlank: false, id: 'idUsername', fieldLabel: 'Username', name: 'user', emptyText: 'username' },
            { allowBlank: false, id: 'idEmail', fieldLabel: 'Email', name: 'email', vtype: 'email', emptyText: 'email' },
            { allowBlank: false, id: 'idPassword', fieldLabel: 'Password', name: 'pass', emptyText: 'password', inputType: 'password' }
        ]
    }],

    buttons: [{
        text: 'Aggiungi',
        disabled: true,
        formBind: true
    }]
});

Ext.define('DocManager.form.Customers', {
    extend: 'Ext.form.Panel',
    xtype: 'add-customer',
    frame: true,
    bodyPadding: 10,
    scrollable: true,
    width: 355,
    fieldDefaults: {
        labelAlign: "right",
        labelWidth: 80,
        msgTarget: 'side'
    },

    items: [{
        xtype: 'fieldset',
        title: 'Info',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [
            { allowBlank: false, id: 'idName', fieldLabel: 'Nome', name: 'customer', emptyText: 'nome cliente' },
            { allowBlank: false, xtype: 'textareafield', id: 'idDescription', fieldLabel: 'Descrizione', name: 'customer' }
        ]
    }],

    buttons: [{
        text: 'Aggiungi',
        disabled: true,
        formBind: true
    }]
});

Ext.define('DocManager.form.Projects', {
    extend: 'Ext.form.Panel',
    xtype: 'add-project',
    frame: true,
    bodyPadding: 10,
    scrollable: true,
    width: 355,
    fieldDefaults: {
        labelAlign: "right",
        labelWidth: 80,
        msgTarget: 'side'
    },

    items: [{
        xtype: 'fieldset',
        title: 'Info',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [
            { allowBlank: false, id: 'idName', fieldLabel: 'Nome', name: 'customer', emptyText: 'nome progetto' },
            { allowBlank: false, xtype: 'textareafield', id: 'idDescription', fieldLabel: 'Descrizione', name: 'customer' }
        ]
    }],

    buttons: [{
        text: 'Aggiungi',
        disabled: true,
        formBind: true
    }]
});

Ext.define('DocManager.form.Documents', {
    extend: 'Ext.form.Panel',
    xtype: 'add-document',
    frame: true,
    bodyPadding: 10,
    scrollable: true,
    width: 355,
    fieldDefaults: {
        labelAlign: "right",
        labelWidth: 80,
        msgTarget: 'side'
    },

    items: [{
        xtype: 'fieldset',
        title: 'Info',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [
            { allowBlank: false, id: 'idTitle', fieldLabel: 'Titolo', name: 'title', emptyText: 'titolo documento' }, 
            { 
                xtype: 'filefield',
                fieldLabel: 'File',
                allowBlank: false,
                buttonText: 'Cerca...',
                listeners:{
                    afterrender:function(cmp){
                        cmp.fileInputEl.set({
                            accept:'application/*'
                        });
                    }
                },
                regex: /^.*\.(pdf|PDF)$/,
                regexText: 'Only PDF files allowed', 
                name: 'document'
            }
        ]
    }],

    buttons: [{
        text: 'Aggiungi',
        disabled: true,
        formBind: true
    }]
});