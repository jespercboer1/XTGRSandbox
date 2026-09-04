<?php

require "db.php";

$userId = isset($_GET["user_id"]) ? (int)$_GET["user_id"] : 0;

if ($userId <= 0) {
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT
        cat_name_id,
        rating
    FROM cat_name_votes
    WHERE user_id = ?
    ORDER BY cat_name_id
");

$stmt->execute([$userId]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
