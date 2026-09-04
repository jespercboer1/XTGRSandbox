<?php

require "db.php";

$stmt = $pdo->prepare("
    SELECT id, username, passcode
    FROM users
    ORDER BY id
");

$stmt->execute();

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC)
);

?>