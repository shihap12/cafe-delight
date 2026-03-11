<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/middleware.php';
handleCors();

$method = $_SERVER['REQUEST_METHOD'];

require_once __DIR__ . '/../../db.php';

if ($method === 'GET') {
    // Public — no auth needed (frontend reads settings)
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
        echo json_encode(['data' => []]);
    }

} elseif ($method === 'PUT') {
    // Protected — admin only
    requireAdmin();
    requireCsrf();

    $payload = json_decode(file_get_contents('php://input'), true);

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid payload']);
        exit;
    }

    $pdo = getPDO();
    $stmt = $pdo->prepare('REPLACE INTO site_settings (setting_key, setting_value) VALUES (:k, :v)');

    $allowedKeys = [
        'hero_line1', 'hero_line2', 'hero_line3', 'hero_subtitle', 'hero_image',
        'about_title', 'about_text1', 'about_text2', 'about_image',
        'footer_brand', 'footer_tagline',
        'social_instagram', 'social_tiktok', 'social_facebook', 'social_whatsapp',
        'theme_classic', 'theme_midnight', 'theme_sunset'
    ];

    foreach ($payload as $key => $value) {
        if (!in_array($key, $allowedKeys)) continue;
        $encoded = is_string($value) ? $value : json_encode($value);
        $stmt->execute([':k' => $key, ':v' => $encoded]);
    }

    echo json_encode(['success' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
