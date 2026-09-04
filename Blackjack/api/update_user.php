<?php
require "bootstrap.php";
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data["username"] ?? "");
$password = $data["password"] ?? null;
$userId = $data["userId"] ?? null;

if ($username === "") {
    echo json_encode(["success"=>false, "message"=>"Please enter a username."]);
    exit;
}

if (strlen($username) > 50) {
    echo json_encode(["success"=>false, "message"=>"Username cannot be longer than 50 characters."]);
    exit;
}

if ($password !== null && $password !== "" && strlen($password) < 6) {
    echo json_encode(["success"=>false, "message"=>"Password must be at least 6 characters long."]);
    exit;
}

if ($password) {
    $pass = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE users SET username=?, password_hash=? WHERE id=?");
    $stmt->execute([$username, $pass, $userId]);
} else {
    $stmt = $pdo->prepare("UPDATE users SET username=? WHERE id=?");
    $stmt->execute([$username, $userId]);
}

echo json_encode(["success"=>true, "message"=>"Your profile was updated successfully."]);