mWebRTC.page.Home = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [{
            xtype: 'mwebrtc-panel-home',
            renderTo: 'mwebrtc-panel-home-div'
        }]
    });
    mWebRTC.page.Home.superclass.constructor.call(this, config);
};
Ext.extend(mWebRTC.page.Home, MODx.Component);
Ext.reg('mwebrtc-page-home', mWebRTC.page.Home);