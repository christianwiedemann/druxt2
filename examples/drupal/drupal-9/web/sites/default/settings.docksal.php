<?php

/**
 * @file
 * Pipelines environment specific settings.
 */

$dir = dirname(DRUPAL_ROOT);

$config['system.file']['path']['temporary'] = '/tmp';
$settings['file_private_path'] = $dir . '/files-private';

/**
 * Database configuration.
 */
$databases = [
  'default' =>
    [
      'default' =>
        [
          'database' => 'default',
          'username' => 'root',
          'password' => 'demo',
          'host' => 'db',
          'port' => '3306',
          'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
          'driver' => 'mysql',
          'prefix' => '',
        ],
    ],
];

