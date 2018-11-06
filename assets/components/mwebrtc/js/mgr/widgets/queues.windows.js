mWebRTC.window.CreateQueue = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'mwebrtc-queue-window-create';
    }
    Ext.applyIf(config, {
        title: _('mwebrtc_queue_create'),
        width: 550,
        autoHeight: true,
        url: mWebRTC.config.connector_url,
        action: 'mgr/queue/create',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    mWebRTC.window.CreateQueue.superclass.constructor.call(this, config);
};
Ext.extend(mWebRTC.window.CreateQueue, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_client_name'),
            name: 'client_name',
            id: config.id + '-client_name',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_session_id'),
            name: 'session_id',
            id: config.id + '-session_id',
            anchor: '99%',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_admin_name'),
            name: 'admin_name',
            id: config.id + '-admin_name',
            anchor: '99%',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_phone_number'),
            name: 'phone_number',
            id: config.id + '-phone_number',
            anchor: '99%',
        }, {
            xtype: 'textarea',
            fieldLabel: _('mwebrtc_queue_message'),
            name: 'message',
            id: config.id + '-message',
            height: 150,
            anchor: '99%'
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_start_datetime'),
            name: 'start_datetime',
            id: config.id + '-start_datetime',
            anchor: '99%',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_end_datetime'),
            name: 'end_datetime',
            id: config.id + '-end_datetime',
            anchor: '99%',
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('mwebrtc-queue-window-create', mWebRTC.window.CreateQueue);


mWebRTC.window.UpdateQueue = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'mwebrtc-queue-window-update';
    }
    Ext.applyIf(config, {
        title: _('mwebrtc_queue_update'),
        width: 550,
        autoHeight: true,
        url: mWebRTC.config.connector_url,
        action: 'mgr/queue/update',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    mWebRTC.window.UpdateQueue.superclass.constructor.call(this, config);
};
Ext.extend(mWebRTC.window.UpdateQueue, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'hidden',
            name: 'id',
            id: config.id + '-id',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_client_name'),
            name: 'client_name',
            id: config.id + '-client_name',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_session_id'),
            name: 'session_id',
            id: config.id + '-session_id',
            anchor: '99%',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_admin_name'),
            name: 'admin_name',
            id: config.id + '-admin_name',
            anchor: '99%',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_phone_number'),
            name: 'phone_number',
            id: config.id + '-phone_number',
            anchor: '99%',
        }, {
            xtype: 'textarea',
            fieldLabel: _('mwebrtc_queue_message'),
            name: 'message',
            id: config.id + '-message',
            height: 150,
            anchor: '99%'
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_start_datetime'),
            name: 'start_datetime',
            id: config.id + '-start_datetime',
            anchor: '99%',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_queue_end_datetime'),
            name: 'end_datetime',
            id: config.id + '-end_datetime',
            anchor: '99%',
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('mwebrtc-queue-window-update', mWebRTC.window.UpdateQueue);