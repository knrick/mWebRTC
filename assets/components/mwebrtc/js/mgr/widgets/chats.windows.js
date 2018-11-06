mWebRTC.window.CreateChat = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'mwebrtc-chat-window-create';
    }
    Ext.applyIf(config, {
        title: _('mwebrtc_chat_create'),
        width: 550,
        autoHeight: true,
        url: mWebRTC.config.connector_url,
        action: 'mgr/chat/create',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    mWebRTC.window.CreateChat.superclass.constructor.call(this, config);
};
Ext.extend(mWebRTC.window.CreateChat, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_chat_sender_id'),
            name: 'sender_name',
            id: config.id + '-sender_name',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_chat_receiver_id'),
            name: 'receiver_name',
            id: config.id + '-receiver_name',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textarea',
            fieldLabel: _('mwebrtc_chat_message'),
            name: 'message',
            id: config.id + '-message',
            height: 150,
            anchor: '99%'
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('mwebrtc-chat-window-create', mWebRTC.window.CreateChat);


mWebRTC.window.UpdateChat = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'mwebrtc-chat-window-update';
    }
    Ext.applyIf(config, {
        title: _('mwebrtc_chat_update'),
        width: 550,
        autoHeight: true,
        url: mWebRTC.config.connector_url,
        action: 'mgr/chat/update',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    mWebRTC.window.UpdateChat.superclass.constructor.call(this, config);
};
Ext.extend(mWebRTC.window.UpdateChat, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'hidden',
            name: 'id',
            id: config.id + '-id',
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_chat_sender_id'),
            name: 'sender_id',
            id: config.id + '-sender_id',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textfield',
            fieldLabel: _('mwebrtc_chat_receiver_id'),
            name: 'receiver_id',
            id: config.id + '-receiver_id',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textarea',
            fieldLabel: _('mwebrtc_chat_message'),
            name: 'message',
            id: config.id + '-message',
            height: 150,
            anchor: '99%'
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('mwebrtc-chat-window-update', mWebRTC.window.UpdateChat);