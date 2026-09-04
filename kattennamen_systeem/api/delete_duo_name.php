<?php

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data) || !isset($data["user_id"], $data["duo_name_id"])) {
    echo json_encode(["success" => false, "message" => "Ongeldige verwijdering"]);
    exit;
}

$userId = (int)$data["user_id"];
$duoNameId = (int)$data["duo_name_id"];

if ($userId <= 0 || $duoNameId <= 0) {
    echo json_encode(["success" => false, "message" => "Ongeldige gegevens"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        DELETE FROM duo_name_votes
        WHERE duo_name_id = ?
    ");
    $stmt->execute([$duoNameId]);

    $stmt = $pdo->prepare("
        DELETE FROM duo_names
        WHERE id = ? AND created_by = ?
    ");
    $stmt->execute([$duoNameId, $userId]);

    if ($stmt->rowCount() === 0) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Je mag dit duo niet verwijderen"]);
        exit;
    }

    $pdo->commit();

    echo json_encode(["success" => true, "message" => "Duo is verwijderd"]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => "Verwijderen mislukt: " . $e->getMessage()]);
}
