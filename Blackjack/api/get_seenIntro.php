<?php
header("Content-Type: application/json");

require "bootstrap.php";
require "db.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode(["seen_intro" => 0]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT COALESCE(us.value, s.default_value) AS value
    FROM stats s
    LEFT JOIN user_stats us
        ON us.stat_code = s.code
        AND us.user_id = ?
    WHERE s.code = 'seen_intro'
");

$stmt->execute([$id]);

$value = $stmt->fetchColumn();

echo json_encode([
    "seen_intro" => (int)$value
]);