<?php

require "db.php";

$userId = isset($_GET["user_id"]) ? (int)$_GET["user_id"] : 0;

if ($userId <= 0) {
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT
        duo_name_id,
        rating
    FROM duo_name_votes
    WHERE user_id = ?
    ORDER BY duo_name_id
");

$stmt->execute([$userId]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
