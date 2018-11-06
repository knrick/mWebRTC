<?php
if (file_exists(dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php')) {
    /** @noinspection PhpIncludeInspection */
    require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
} else {
    require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php';
}
/** @noinspection PhpIncludeInspection */
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
/** @noinspection PhpIncludeInspection */
require_once MODX_CONNECTORS_PATH . 'index.php';
/** @var mWebRTC $mWebRTC */
$mWebRTC = $modx->getService('mWebRTC', 'mWebRTC', MODX_CORE_PATH . 'components/mwebrtc/model/');
$modx->lexicon->load('mwebrtc:default');

// handle request
$corePath = $modx->getOption('mwebrtc_core_path', null, $modx->getOption('core_path') . 'components/mwebrtc/');
$path = $modx->getOption('processorsPath', $mWebRTC->config, $corePath . 'processors/');
$modx->getRequest();

/** @var modConnectorRequest $request */
$request = $modx->request;
$request->handleRequest([
    'processors_path' => $path,
    'location' => '',
]);