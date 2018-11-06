<?php
$xpdo_meta_map['WebrtcChat']= array (
  'package' => 'mwebrtc',
  'version' => '1.1',
  'table' => 'mwebrtc_chat',
  'extends' => 'xPDOSimpleObject',
  'tableMeta' => 
  array (
    'engine' => 'MyISAM',
  ),
  'fields' => 
  array (
    'datetime' => 'CURRENT_TIMESTAMP',
    'sender_id' => NULL,
    'receiver_id' => NULL,
    'message' => NULL,
    'from_admin' => NULL,
  ),
  'fieldMeta' => 
  array (
    'datetime' => 
    array (
      'dbtype' => 'timestamp',
      'phptype' => 'timestamp',
      'null' => false,
      'default' => 'CURRENT_TIMESTAMP',
    ),
    'sender_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '11',
      'phptype' => 'integer',
      'null' => true,
    ),
    'receiver_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '11',
      'phptype' => 'integer',
      'null' => true,
    ),
    'message' => 
    array (
      'dbtype' => 'text',
      'phptype' => 'string',
      'null' => true,
    ),
    'from_admin' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'integer',
      'null' => true,
    ),
  ),
);
