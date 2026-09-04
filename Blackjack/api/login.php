<?php
require "bootstrap.php";
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {
    echo json_encode(["success"=>false, "message"=>"Please enter both your username and password."]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username=?");
$stmt->execute([$username]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success"=>false, "message"=>"No account was found with that username."]);
    exit;
}

if (!password_verify($password, $user["password_hash"])) {
    echo json_encode(["success"=>false, "message"=>"The password you entered is incorrect."]);
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
$stmt->execute([$user["id"]]);

echo json_encode(["success"=>true, "userId"=>$user["id"], "message"=>"Login successful."]);