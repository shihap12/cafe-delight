<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/middleware.php';
handleCors();
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    requireCsrf();
}

require_once __DIR__ . '/../../db.php';
$pdo = getPDO();

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, name, description, price, category, image FROM menu_items ORDER BY id');
    echo json_encode(['data' => $stmt->fetchAll()]);

} elseif ($method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);

    $name = trim($payload['name'] ?? '');
    $description = trim($payload['description'] ?? '');
    $price = floatval($payload['price'] ?? 0);
    $category = trim($payload['category'] ?? '');
    $image = trim($payload['image'] ?? '');

    $errors = [];
    if ($name === '') $errors[] = 'Name is required';
    if (mb_strlen($name) > 255) $errors[] = 'Name too long (max 255 chars)';
    if ($description === '') $errors[] = 'Description is required';
    if ($price <= 0 || $price > 99999) $errors[] = 'Price must be between 0.01 and 99999';
    if (!in_array($category, ['Drinks', 'Desserts'])) $errors[] = 'Category must be Drinks or Desserts';
    if ($image === '') $errors[] = 'Image is required';

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation failed', 'errors' => $errors]);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO menu_items (name, description, price, category, image) VALUES (:n, :d, :p, :c, :i)');
    $stmt->execute([':n' => $name, ':d' => $description, ':p' => $price, ':c' => $category, ':i' => $image]);

    echo json_encode(['success' => true, 'id' => (int)$pdo->lastInsertId()]);

} elseif ($method === 'PUT') {
    $payload = json_decode(file_get_contents('php://input'), true);

    $id = intval($payload['id'] ?? 0);
    $name = trim($payload['name'] ?? '');
    $description = trim($payload['description'] ?? '');
    $price = floatval($payload['price'] ?? 0);
    $category = trim($payload['category'] ?? '');
    $image = trim($payload['image'] ?? '');

    $errors = [];
    if ($id <= 0) $errors[] = 'Invalid product ID';
    if ($name === '') $errors[] = 'Name is required';
    if (mb_strlen($name) > 255) $errors[] = 'Name too long (max 255 chars)';
    if ($description === '') $errors[] = 'Description is required';
    if ($price <= 0 || $price > 99999) $errors[] = 'Price must be between 0.01 and 99999';
    if (!in_array($category, ['Drinks', 'Desserts'])) $errors[] = 'Category must be Drinks or Desserts';
    if ($image === '') $errors[] = 'Image is required';

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation failed', 'errors' => $errors]);
        exit;
    }

    $stmt = $pdo->prepare('UPDATE menu_items SET name=:n, description=:d, price=:p, category=:c, image=:i WHERE id=:id');
    $stmt->execute([':n' => $name, ':d' => $description, ':p' => $price, ':c' => $category, ':i' => $image, ':id' => $id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        exit;
    }

    echo json_encode(['success' => true]);

} elseif ($method === 'DELETE') {
    $payload = json_decode(file_get_contents('php://input'), true);
    $id = intval($payload['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(422);
        echo json_encode(['error' => 'Invalid product ID']);
        exit;
    }

    // Check for order_items references — soft-fail
    $stmt = $pdo->prepare('SELECT COUNT(*) as cnt FROM order_items WHERE menu_item_id = :id');
    $stmt->execute([':id' => $id]);
    $ref = $stmt->fetch();
    if ($ref && $ref['cnt'] > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Cannot delete: product is referenced in existing orders']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM menu_items WHERE id = :id');
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
