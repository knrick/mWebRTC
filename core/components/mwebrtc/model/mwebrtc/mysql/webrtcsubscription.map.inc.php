<?php
$xpdo_meta_map['WebrtcSubscription']= array (
  'package' => 'mwebrtc',
  'version' => '1.1',
  'table' => 'mwebrtc_subscription',
  'extends' => 'xPDOSimpleObject',
  'tableMeta' => 
  array (
    'engine' => 'MyISAM',
  ),
  'fields' => 
  array (
    'endpoint' => NULL,
    'admin_id' => NULL,
  ),
  'fieldMeta' => 
  array (
    'endpoint' => 
    array (
      'dbtype' => 'text',
      'phptype' => 'string',
      'null' => true,
    ),
    'admin_id' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => true,
    ),
  ),
);
