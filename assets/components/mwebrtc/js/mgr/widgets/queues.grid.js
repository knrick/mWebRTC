mWebRTC.grid.Queues = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'mwebrtc-grid-queues';
    }
    Ext.applyIf(config, {
        url: mWebRTC.config.connector_url,
        fields: this.getFields(config),
        columns: this.getColumns(config),
        tbar: this.getTopBar(config),
        sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/queue/getlist'
        },
        listeners: {
            rowDblClick: function (grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updateQueue(grid, e, row);
            }
        },
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            autoFill: true,
            showPreview: true,
            scrollOffset: 0,
            getRowClass: function (rec) {
                return !rec.data.active
                    ? 'mwebrtc-grid-row-disabled'
                    : '';
            }
        },
        paging: true,
        remoteSort: true,
        autoHeight: true,
    });
    mWebRTC.grid.Queues.superclass.constructor.call(this, config);

    // Clear selection on grid refresh
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
    }, this);
};
Ext.extend(mWebRTC.grid.Queues, MODx.grid.Grid, {
    windows: {},

    getMenu: function (grid, rowIndex) {
        var ids = this._getSelectedIds();

        var row = grid.getStore().getAt(rowIndex);
        var menu = mWebRTC.utils.getMenu(row.data['actions'], this, ids);

        this.addContextMenuItem(menu);
    },

    createQueue: function (btn, e) {
        var w = MODx.load({
            xtype: 'mwebrtc-queue-window-create',
            id: Ext.id(),
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        });
        w.reset();
        w.setValues({active: true});
        w.show(e.target);
    },

    updateQueue: function (btn, e, row) {
        if (typeof(row) != 'undefined') {
            this.menu.record = row.data;
        }
        else if (!this.menu.record) {
            return false;
        }
        var id = this.menu.record.id;

        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/queue/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = MODx.load({
                            xtype: 'mwebrtc-queue-window-update',
                            id: Ext.id(),
                            record: r,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                }
                            }
                        });
                        w.reset();
                        w.setValues(r.object);
                        w.show(e.target);
                    }, scope: this
                }
            }
        });
    },

    removeQueue: function () {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.msg.confirm({
            title: ids.length > 1
                ? _('mwebrtc_queues_remove')
                : _('mwebrtc_queue_remove'),
            text: ids.length > 1
                ? _('mwebrtc_queues_remove_confirm')
                : _('mwebrtc_queue_remove_confirm'),
            url: this.config.url,
            params: {
                action: 'mgr/queue/remove',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        });
        return true;
    },

    disableQueue: function () {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/queue/disable',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        })
    },

    enableQueue: function () {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/queue/enable',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        })
    },

    getFields: function () {
        return ['id', 'client_name', 'session_id', 'admin_name', 'phone_number', 'message', 'start_datetime', 'end_datetime', 'actions'];
    },

    getColumns: function () {
        return [{
            header: _('mwebrtc_queue_id'),
            dataIndex: 'id',
            sortable: true,
            width: 50
        }, {
            header: _('mwebrtc_queue_client_name'),
            dataIndex: 'client_name',
            sortable: true,
            width: 150,
        }, {
            header: _('mwebrtc_queue_session_id'),
            dataIndex: 'session_id',
            sortable: false,
            width: 150,
        }, {
            header: _('mwebrtc_queue_admin_name'),
            dataIndex: 'admin_name',
            sortable: true,
            width: 150,
        }, {
            header: _('mwebrtc_queue_phone_number'),
            dataIndex: 'phone_number',
            sortable: true,
            width: 100,
        }, {
            header: _('mwebrtc_queue_message'),
            dataIndex: 'message',
            sortable: true,
            width: 200,
        }, {
            header: _('mwebrtc_queue_start_datetime'),
            dataIndex: 'start_datetime',
            sortable: true,
            width: 100,
        }, {
            header: _('mwebrtc_queue_end_datetime'),
            dataIndex: 'end_datetime',
            sortable: true,
            width: 150,
        }, {
            header: _('mwebrtc_grid_actions'),
            dataIndex: 'actions',
            renderer: mWebRTC.utils.renderActions,
            sortable: false,
            width: 150,
            id: 'actions'
        }];
    },

    getTopBar: function () {
        return [{
            text: '<i class="icon icon-plus"></i>&nbsp;' + _('mwebrtc_queue_create'),
            handler: this.createQueue,
            scope: this
        }, '->', {
            xtype: 'mwebrtc-field-search',
            width: 250,
            listeners: {
                search: {
                    fn: function (field) {
                        this._doSearch(field);
                    }, scope: this
                },
                clear: {
                    fn: function (field) {
                        field.setValue('');
                        this._clearSearch();
                    }, scope: this
                },
            }
        }];
    },

    onClick: function (e) {
        var elem = e.getTarget();
        if (elem.nodeName == 'BUTTON') {
            var row = this.getSelectionModel().getSelected();
            if (typeof(row) != 'undefined') {
                var action = elem.getAttribute('action');
                if (action == 'showMenu') {
                    var ri = this.getStore().find('id', row.id);
                    return this._showMenu(this, ri, e);
                }
                else if (typeof this[action] === 'function') {
                    this.menu.record = row.data;
                    return this[action](this, e);
                }
            }
        }
        return this.processEvent('click', e);
    },

    _getSelectedIds: function () {
        var ids = [];
        var selected = this.getSelectionModel().getSelections();

        for (var i in selected) {
            if (!selected.hasOwnProperty(i)) {
                continue;
            }
            ids.push(selected[i]['id']);
        }

        return ids;
    },

    _doSearch: function (tf) {
        this.getStore().baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
    },

    _clearSearch: function () {
        this.getStore().baseParams.query = '';
        this.getBottomToolbar().changePage(1);
    },
});
Ext.reg('mwebrtc-grid-queues', mWebRTC.grid.Queues);
