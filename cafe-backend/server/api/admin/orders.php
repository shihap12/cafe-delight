<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/middleware.php';
handleCors();
requireAdmin();

require_once __DIR__ . '/../../db.php';
$pdo = getPDO();

$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
$offset = ($page - 1) * $limit;

$countStmt = $pdo->query('SELECT COUNT(*) as total FROM orders');
$total = (int)$countStmt->fetch()['total'];

$stmt = $pdo->prepare(
    'SELECT o.id, o.customer_name, o.customer_phone, o.notes, o.total_amount, o.created_at
     FROM orders o
     ORDER BY o.created_at DESC
     LIMIT :limit OFFSET :offset'
);
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$orders = $stmt->fetchAll();

// Fetch items for each order
$itemStmt = $pdo->prepare(
    'SELECT oi.quantity, oi.unit_price, mi.name
     FROM order_items oi
     LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
     WHERE oi.order_id = :oid'
);

foreach ($orders as &$order) {
    $itemStmt->execute([':oid' => $order['id']]);
    $order['items'] = $itemStmt->fetchAll();
}

echo json_encode([
    'data' => $orders,
    'total' => $total,
    'page' => $page,
    'pages' => ceil($total / $limit)
]);
