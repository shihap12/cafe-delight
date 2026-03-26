<?php
require_once __DIR__ . '/middleware.php';
handleCors();
initAdminSession();
requireAdmin();

// CSRF via header (FormData uploads can't set body, but can set headers)
$csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $csrfToken)) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid CSRF token']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No image uploaded or upload error']);
    exit;
}

$file = $_FILES['image'];
$maxSize = 5 * 1024 * 1024; // 5 MB

if ($file['size'] > $maxSize) {
    http_response_code(422);
    echo json_encode(['error' => 'Image too large. Maximum 5 MB.']);
    exit;
}

// Validate MIME type via finfo (ignores extension spoofing)
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
$allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/avif' => 'avif',
    'image/gif'  => 'gif',
];

if (!isset($allowed[$mime])) {
    http_response_code(422);
    echo json_encode(['error' => 'Invalid image type. Allowed: jpg, png, webp, avif, gif']);
    exit;
}

$ext = $allowed[$mime];
$filename = bin2hex(random_bytes(16)) . '.' . $ext;

// Save to uploads directory alongside the server folder
$uploadDir = realpath(__DIR__ . '/../../..') . DIRECTORY_SEPARATOR . 'uploads';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$targetPath = $uploadDir . DIRECTORY_SEPARATOR . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save image']);
    exit;
}

echo json_encode(['success' => true, 'path' => '/uploads/' . $filename]);
