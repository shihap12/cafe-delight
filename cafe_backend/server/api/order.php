<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../db.php';

$payload = json_decode(file_get_contents('php://input'), true);

if (!is_array($payload) || !isset($payload['items']) || !is_array($payload['items'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid payload. Expecting { items: [...] }."]);
    exit;
}

$items = $payload['items'];
$customer = is_array($payload['customer'] ?? null) ? $payload['customer'] : [];

$customerName = trim($customer['name'] ?? ($payload['customerName'] ?? ''));
$customerPhone = trim($customer['phone'] ?? ($payload['customerPhone'] ?? ''));
$customerNotes = trim($customer['notes'] ?? ($payload['notes'] ?? ''));

if ($customerName === '' || $customerPhone === '') {
    http_response_code(422);
    echo json_encode(["error" => "Customer name and phone are required."]);
    exit;
}

try {
    $pdo = getPDO();
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        'INSERT INTO orders (customer_name, customer_phone, notes, total_amount, created_at) VALUES (:name, :phone, :notes, :total, NOW())'
    );

    $total = 0;
    foreach ($items as $item) {
        $price = floatval($item['price'] ?? 0);
        $quantity = intval($item['quantity'] ?? 1);
        $total += $price * $quantity;
    }

    $stmt->execute([
        ':name' => $customerName,
        ':phone' => $customerPhone,
        ':notes' => $customerNotes,
        ':total' => $total,
    ]);

    $orderId = $pdo->lastInsertId();

    $itemStmt = $pdo->prepare(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (:orderId, :menuId, :qty, :price)'
    );

    foreach ($items as $item) {
        $itemStmt->execute([
            ':orderId' => $orderId,
            ':menuId' => intval($item['id']),
            ':qty' => intval($item['quantity'] ?? 1),
            ':price' => floatval($item['price'] ?? 0),
        ]);
    }

    $pdo->commit();

    echo json_encode(["success" => true, "orderId" => $orderId]);
} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode(["error" => "Failed to place order", "details" => $e->getMessage()]);
}
