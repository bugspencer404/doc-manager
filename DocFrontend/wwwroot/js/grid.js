function disableAdminTools(columns, nActionCols) {
    Ext.getCmp('idBtnAdd').up().setHidden(true);
    var revColumns = columns.reverse();
    for (var i = 0; i < nActionCols; i++) {
        var actioncolumn = revColumns[i];
        if (actioncolumn.name === 'approvalcolumn')
            continue;
        actioncolumn.setHidden(true);
    }
}

function disableOperatorTools(columns, nActionCols) {
    var revColumns = columns.reverse();
    for (var i = 0; i < nActionCols; i++) {
        var actioncolumn = revColumns[i];
        if (actioncolumn.name !== 'approvalcolumn')
            continue;
        actioncolumn.setHidden(true);
    }
}

Ext.define('DocsManager.Grid', {
    extend: 'Ext.grid.Panel',
    cls: 'grid-class',
    width: 800,
    height: 300,
    title: 'Application',
    tbar: [
        {
            iconCls: 'icon-add',
            tooltip: 'Aggiungi',
            id: 'idBtnAdd',
            text: 'Aggiungi',
            width: 110,
            iconAlign: 'left',
            handler: function (btn) {
                var grid = btn.up().up();
                onItemAdd(grid);
            }
        }
    ],
    columns: []
});