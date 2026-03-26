<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../db.php';

$pdo = getPDO();

try {
    $stmt = $pdo->query('SELECT id, name, description, price, category, image FROM menu_items ORDER BY id');
    $items = $stmt->fetchAll();
    echo json_encode(["data" => $items]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to read menu items", "details" => $e->getMessage()]);
}
