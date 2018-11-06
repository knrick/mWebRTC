<?php
/** @var xPDOTransport $transport */
/** @var array $options */
/** @var modX $modx */
if ($transport->xpdo) {
    $modx =& $transport->xpdo;

    $dev = MODX_BASE_PATH . 'Extras/mWebRTC/';
    /** @var xPDOCacheManager $cache */
    $cache = $modx->getCacheManager();
    if (file_exists($dev) && $cache) {
        if (!is_link($dev . 'assets/components/mwebrtc')) {
            $cache->deleteTree(
                $dev . 'assets/components/mwebrtc/',
                ['deleteTop' => true, 'skipDirs' => false, 'extensions' => []]
            );
            symlink(MODX_ASSETS_PATH . 'components/mwebrtc/', $dev . 'assets/components/mwebrtc');
        }
        if (!is_link($dev . 'core/components/mwebrtc')) {
            $cache->deleteTree(
                $dev . 'core/components/mwebrtc/',
                ['deleteTop' => true, 'skipDirs' => false, 'extensions' => []]
            );
            symlink(MODX_CORE_PATH . 'components/mwebrtc/', $dev . 'core/components/mwebrtc');
        }
    }
}

return true;