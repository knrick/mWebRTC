mWebRTC.panel.Home = function (config) {
    config = config || {};
    Ext.apply(config, {
        baseCls: 'modx-formpanel',
        layout: 'anchor',
        /*
         stateful: true,
         stateId: 'mwebrtc-panel-home',
         stateEvents: ['tabchange'],
         getState:function() {return {activeTab:this.items.indexOf(this.getActiveTab())};},
         */
        hideMode: 'offsets',
        items: [{
            html: '<h2>' + _('mwebrtc') + '</h2>',
            cls: '',
            style: {margin: '15px 0'}
        }, {
            xtype: 'modx-tabs',
            defaults: {border: false, autoHeight: true},
            border: true,
            hideMode: 'offsets',
            items: [{
                title: _('mwebrtc_queues'),
                layout: 'anchor',
                items: [{
                    html: _('mwebrtc_intro_msg'),
                    cls: 'panel-desc',
                }, {
                    xtype: 'mwebrtc-grid-queues',
                    cls: 'main-wrapper',
                }]
            },{
                title: _('mwebrtc_rooms'),
                layout: 'anchor',
                items: [{
                    html: _('mwebrtc_intro_msg'),
                    cls: 'panel-desc',
                }, {
                    xtype: 'mwebrtc-grid-rooms',
                    cls: 'main-wrapper',
                }]
            }]
        }]
    });
    mWebRTC.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(mWebRTC.panel.Home, MODx.Panel);
Ext.reg('mwebrtc-panel-home', mWebRTC.panel.Home);
