<?php

return [
    'service_worker' => [
        'xtype' => 'textfield',
        'value' => 'sw.js',
        'area' => 'mwebrtc_main',
    ],
    'webpush_vapid_public_key' => [
        'xtype' => 'textfield',
        'value' => 'BLGEJmdvFp36U0xQBv5jZRKAzLiM44tpHPpSiiPD654YX_-CY7Oub6A6epvJh1hNY_yfI-lqW_doEDH7rlPT8gU',
        'area' => 'mwebrtc_webpush',
    ],
    'webpush_vapid_private_key' => [
        'xtype' => 'textfield',
        'value' => 'Ptu53F6pjlI8xSZz5nPpVsZGndol0539AGdoinqlwIY',
        'area' => 'mwebrtc_webpush',
    ],
    'webpush_vapid_subject' => [
        'xtype' => 'textfield',
        'value' => '',
        'area' => 'mwebrtc_webpush',
    ],
    'client_url' => [
        'xtype' => 'textfield',
        'value' => '',
        'area' => 'mwebrtc_url',
    ],
    'admin_url' => [
        'xtype' => 'textfield',
        'value' => '',
        'area' => 'mwebrtc_url',
    ],
];