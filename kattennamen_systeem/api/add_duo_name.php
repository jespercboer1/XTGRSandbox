<?php

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data) || !isset($data["user_id"]) || !isset($data["cat_name_1"]) || !isset($data["cat_name_2"])) {
    echo json_encode(["success" => false, "message" => "Ongeldige duo-data"]);
    exit;
}

$userId = (int)$data["user_id"];
$cat1 = (int)$data["cat_name_1"];
$cat2 = (int)$data["cat_name_2"];

if ($userId <= 0 || $cat1 <= 0 || $cat2 <= 0 || $cat1 === $cat2) {
    echo json_encode(["success" => false, "message" => "Kies precies 2 verschillende namen"]);
    exit;
}

if ($cat1 > $cat2) {
    [$cat1, $cat2] = [$cat2, $cat1];
}

$stmt = $pdo->prepare("
    SELECT COUNT(*)
    FROM duo_names
    WHERE cat_name_1 = ? AND cat_name_2 = ?
");

$stmt->execute([$cat1, $cat2]);

if ($stmt->fetchColumn() > 0) {
    echo json_encode(["success" => false, "message" => "Dit duo bestaat al."]);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO duo_names (cat_name_1, cat_name_2, created_by)
    VALUES (?, ?, ?)
");

$stmt->execute([$cat1, $cat2, $userId]);

echo json_encode([
    "success" => true,
    "message" => "Duo is opgeslagen."
]);
?>
