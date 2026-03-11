<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../db.php';

try {
    $pdo = getPDO();
    $stmt = $pdo->query('SELECT setting_key, setting_value FROM site_settings');
    $settings = [];
    while ($row = $stmt->fetch()) {
        $decoded = json_decode($row['setting_value'], true);
        $settings[$row['setting_key']] = ($decoded !== null) ? $decoded : $row['setting_value'];
    }
    echo json_encode(['data' => $settings]);
} catch (Exception $e) {
    // Return empty if table doesn't exist yet
    echo json_encode(['data' => []]);
}
