<?php
header("Content-Type: application/json");

require "bootstrap.php";
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data["userId"] ?? null;
$stat = $data["stat"] ?? null;
$amount = $data["amount"] ?? 1;

if (!$userId || !$stat) {
    http_response_code(400);
    echo json_encode(["success" => false]);
    exit;
}

// Check if the stat exists
$stmt = $pdo->prepare("SELECT default_value FROM stats WHERE code = ?");
$stmt->execute([$stat]);
$default = $stmt->fetchColumn();

if ($default === false) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Unknown stat"
    ]);
    exit;
}

// Create the stat if the user doesn't have it yet,
// otherwise increase its value.
$stmt = $pdo->prepare("
    INSERT INTO user_stats (user_id, stat_code, value)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
        value = value + VALUES(value)
");

$stmt->execute([
    $userId,
    $stat,
    $default + $amount
]);

echo json_encode(["success" => true]);