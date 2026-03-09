<?php
// setup.php
// Run this script once to create the database + tables + sample data using server/schema.sql.
// Usage (in browser): http://localhost:8000/setup.php
// (Requires PHP + MySQL and correct values in config.php)

require_once __DIR__ . '/config.php';

function getPDO() {
    global $DB_HOST, $DB_PORT, $DB_NAME, $DB_USER, $DB_PASS;
    $dsn = "mysql:host={$DB_HOST};port={$DB_PORT};charset=utf8mb4";

    try {
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo "<h1>Database connection failed</h1>";
        echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
        exit;
    }
}

$schemaFile = __DIR__ . '/schema.sql';
if (!file_exists($schemaFile)) {
    http_response_code(500);
    echo "<h1>schema.sql not found</h1>";
    exit;
}

$sql = file_get_contents($schemaFile);
if ($sql === false) {
    http_response_code(500);
    echo "<h1>Failed to read schema.sql</h1>";
    exit;
}

$pdo = getPDO();

try {
    // Split statements by ';' while ignoring semicolons inside strings.
    $pdo->beginTransaction();
    $statements = preg_split('/;\s*\n/', $sql);
    foreach ($statements as $statement) {
        $stmt = trim($statement);
        if ($stmt === '') continue;
        $pdo->exec($stmt);
    }
    $pdo->commit();
    echo "<h1>Setup complete</h1>\n";
    echo "<p>The database and tables are now created, and sample data is inserted.</p>";
    echo "<p>Go back to <a href=\"/\">frontend</a> or use the API at <code>/api/menu</code>.</p>";
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo "<h1>Setup failed</h1>";
    echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
}
