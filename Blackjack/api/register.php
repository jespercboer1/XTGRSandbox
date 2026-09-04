<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
require "bootstrap.php";
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "") {
    echo json_encode(["success" => false, "message" => "Please enter a username."]);
    exit;
}

if (strlen($username) > 50) {
    echo json_encode(["success" => false, "message" => "Username cannot be longer than 50 characters."]);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters long."]);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE username=?");
$stmt->execute([$username]);

if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "That username is already taken. Please choose another one."]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
    $stmt->execute([$username, $hashedPassword]);

    $userId = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO user_stats (user_id) VALUES (?)");
    $stmt->execute([$userId]);

    $stmt = $pdo->prepare("
        INSERT INTO user_cards (user_id, card_id, quantity)
        SELECT ?, id, 1
        FROM cards
        WHERE style_id = 1;
    ");
    $stmt->execute([$userId]);

    $stmt = $pdo->prepare("
        INSERT INTO user_active_cards (user_id, card_id)
        SELECT ?, id
        FROM cards
        WHERE style_id = 1
    ");
    $stmt->execute([$userId]);

    echo json_encode([
        "success" => true,
        "userId" => $userId,
        "message" => "Account created successfully."
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Registration failed. Please try again."]);
}
?>