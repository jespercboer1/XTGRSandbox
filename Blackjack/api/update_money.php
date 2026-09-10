<?php
header("Content-Type: application/json");

require "bootstrap.php";
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data["userId"] ?? null;
$money = $data["newMoney"] ?? null;

if (!$userId || $money === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "missing data"]);
    exit;
}

$money = (int)$money;

/* ensure stat exists in stats table */
$stmt = $pdo->prepare("SELECT code FROM stats WHERE code = 'money'");
$stmt->execute();

if (!$stmt->fetchColumn()) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "money stat not defined"]);
    exit;
}

/* insert or overwrite (SET, not add) */
$stmt = $pdo->prepare("
    INSERT INTO user_stats (user_id, stat_code, value)
    VALUES (?, 'money', ?)
    ON DUPLICATE KEY UPDATE
        value = VALUES(value)
");

$stmt->execute([$userId, $money]);

echo json_encode([
    "success" => true,
    "money" => $money
]);