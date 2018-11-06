<?php

/**
 * The home manager controller for mWebRTC.
 *
 */
class mWebRTCHomeManagerController extends modExtraManagerController
{
    /** @var mWebRTC $mWebRTC */
    public $mWebRTC;


    /**
     *
     */
    public function initialize()
    {
        $this->mWebRTC = $this->modx->getService('mWebRTC', 'mWebRTC', MODX_CORE_PATH . 'components/mwebrtc/model/');
        parent::initialize();
    }


    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return ['mwebrtc:default'];
    }


    /**
     * @return bool
     */
    public function checkPermissions()
    {
        return true;
    }


    /**
     * @return null|string
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('mwebrtc');
    }


    /**
     * @return void
     */
    public function loadCustomCssJs()
    {
        $this->addCss($this->mWebRTC->config['cssUrl'] . 'mgr/main.css');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/mwebrtc.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/misc/utils.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/misc/combo.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/widgets/chats.grid.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/widgets/chats.windows.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/widgets/queues.grid.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/widgets/queues.windows.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/widgets/rooms.grid.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/widgets/rooms.windows.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/widgets/home.panel.js');
        $this->addJavascript($this->mWebRTC->config['jsUrl'] . 'mgr/sections/home.js');

        $this->addHtml('<script type="text/javascript">
        mWebRTC.config = ' . json_encode($this->mWebRTC->config) . ';
        mWebRTC.config.connector_url = "' . $this->mWebRTC->config['connectorUrl'] . '";
        Ext.onReady(function() {MODx.load({ xtype: "mwebrtc-page-home"});});
        </script>');
    }


    /**
     * @return string
     */
    public function getTemplateFile()
    {
        $this->content .= '<div id="mwebrtc-panel-home-div"></div>';

        return '';
    }
}