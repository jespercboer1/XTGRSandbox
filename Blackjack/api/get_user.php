<?php
require "bootstrap.php";
require "db.php";

$id = $_GET["id"];

$stmt = $pdo->prepare("SELECT id, username, created_at FROM users WHERE id=?");
$stmt->execute([$id]);

echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));