<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

try {
    $pdo = getPDO();
    $stmt = $pdo->query('SELECT id, username, created_at FROM admin_users');
    $users = $stmt->fetchAll();
    echo json_encode(['count' => count($users), 'users' => $users]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to query admin_users', 'details' => $e->getMessage()]);
}

// Usage: open in browser: http://localhost/cafe/server/check_admin.php
// This is a development helper — remove in production.
