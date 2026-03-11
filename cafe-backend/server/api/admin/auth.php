<?php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/middleware.php';
handleCors();
require_once __DIR__ . '/../../db.php';

$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'POST') {
    // --- Login ---
    initAdminSession();
    $payload = json_decode(file_get_contents('php://input'), true);
    $username = trim($payload['username'] ?? '');
    $password = $payload['password'] ?? '';

    if ($username === '' || $password === '') {
        http_response_code(422);
        echo json_encode(['error' => 'Username and password are required']);
        exit;
    }

    // Rate limiting by IP (stored in session)
    $ip = $_SERVER['REMOTE_ADDR'];
    $rateKey = 'login_attempts_' . hash('sha256', $ip);
    if (isset($_SESSION[$rateKey]) && $_SESSION[$rateKey]['count'] >= 5) {
        $elapsed = time() - $_SESSION[$rateKey]['first'];
        if ($elapsed < 900) {
            http_response_code(429);
            echo json_encode(['error' => 'Too many attempts. Try again in 15 minutes.']);
            exit;
        }
        unset($_SESSION[$rateKey]);
    }

    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT id, username, password_hash FROM admin_users WHERE username = :u LIMIT 1');
    $stmt->execute([':u' => $username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        if (!isset($_SESSION[$rateKey])) {
            $_SESSION[$rateKey] = ['count' => 0, 'first' => time()];
        }
        $_SESSION[$rateKey]['count']++;
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username or password']);
        exit;
    }

    session_regenerate_id(true);
    $_SESSION['admin_id'] = $user['id'];
    $_SESSION['admin_username'] = $user['username'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    unset($_SESSION[$rateKey]);

    echo json_encode([
        'success' => true,
        'user' => ['id' => $user['id'], 'username' => $user['username']],
        'csrfToken' => $_SESSION['csrf_token']
    ]);

} elseif ($method === 'GET') {
    // --- Check session ---
    // لا تنشئ جلسة جديدة إذا لم يكن هناك كوكيز جلسة
    if (isset($_COOKIE[session_name()])) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    if (!empty($_SESSION['admin_id'])) {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        echo json_encode([
            'authenticated' => true,
            'user' => ['id' => $_SESSION['admin_id'], 'username' => $_SESSION['admin_username']],
            'csrfToken' => $_SESSION['csrf_token']
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
    }

} elseif ($method === 'DELETE') {
    // --- Logout ---
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    session_destroy();
    echo json_encode(['success' => true]);
} elseif ($method === 'PUT') {
    // --- Change password ---
    requireAdmin();
    requireCsrf();

    $payload = json_decode(file_get_contents('php://input'), true);
    $currentPassword = $payload['currentPassword'] ?? '';
    $newPassword = $payload['newPassword'] ?? '';

    if ($currentPassword === '' || $newPassword === '') {
        http_response_code(422);
        echo json_encode(['error' => 'Current and new passwords are required']);
        exit;
    }

    if (strlen($newPassword) < 6) {
        http_response_code(422);
        echo json_encode(['error' => 'New password must be at least 6 characters']);
        exit;
    }

    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT password_hash FROM admin_users WHERE id = :id');
    $stmt->execute([':id' => $_SESSION['admin_id']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Current password is incorrect']);
        exit;
    }

    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('UPDATE admin_users SET password_hash = :hash WHERE id = :id');
    $stmt->execute([':hash' => $newHash, ':id' => $_SESSION['admin_id']]);

    echo json_encode(['success' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
