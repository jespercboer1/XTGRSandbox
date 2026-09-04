<?php
header('Content-Type: application/json');

require "bootstrap.php";
require "db.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode(["error" => "missing id"]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT
        s.code,
        s.default_value,
        us.value
    FROM stats s
    LEFT JOIN user_stats us
        ON us.stat_code = s.code
        AND us.user_id = ?
    ORDER BY s.name
");

$stmt->execute([$id]);

$stats = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $stats[$row["code"]] = $row["value"] ?? $row["default_value"];
}

echo json_encode($stats);