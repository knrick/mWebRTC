mWebRTC.window.CreateRoom = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'mwebrtc-room-window-create';
    }
    Ext.applyIf(config, {
        title: _('mwebrtc_room_create'),
        width: 550,
        autoHeight: true,
        url: mWebRTC.config.connector_url,
        action: 'mgr/room/create',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    mWebRTC.window.CreateRoom.superclass.constructor.call(this, config);
};
Ext.extend(mWebRTC.window.CreateRoom, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_room_client_name'),
            name: 'client_name',
            id: config.id + '-client_name',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_room_admin_name'),
            name: 'admin_name',
            id: config.id + '-admin_name',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_room_start_datetime'),
            name: 'start_datetime',
            id: config.id + '-start_datetime',
            anchor: '99%',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_room_end_datetime'),
            name: 'end_datetime',
            id: config.id + '-end_datetime',
            anchor: '99%',
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('mwebrtc-room-window-create', mWebRTC.window.CreateRoom);


mWebRTC.window.UpdateRoom = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'mwebrtc-room-window-update';
    }
    Ext.applyIf(config, {
        title: _('mwebrtc_room_update'),
        width: 550,
        autoHeight: true,
        url: mWebRTC.config.connector_url,
        action: 'mgr/room/update',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    mWebRTC.window.UpdateRoom.superclass.constructor.call(this, config);
};
Ext.extend(mWebRTC.window.UpdateRoom, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'hidden',
            name: 'id',
            id: config.id + '-id',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_room_client_name'),
            name: 'client_name',
            id: config.id + '-client_name',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_room_admin_name'),
            name: 'admin_name',
            id: config.id + '-admin_name',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_room_start_datetime'),
            name: 'start_datetime',
            id: config.id + '-start_datetime',
            anchor: '99%',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_room_end_datetime'),
            name: 'end_datetime',
            id: config.id + '-end_datetime',
            anchor: '99%',
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('mwebrtc-room-window-update', mWebRTC.window.UpdateRoom);