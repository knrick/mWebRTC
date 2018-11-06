var mWebRTC = function (config) {
    config = config || {};
    mWebRTC.superclass.constructor.call(this, config);
};
Ext.extend(mWebRTC, Ext.Component, {
    page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}, view: {}, utils: {}
});
Ext.reg('mwebrtc', mWebRTC);

mWebRTC = new mWebRTC();