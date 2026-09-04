<?php

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data) || !isset($data["user_id"], $data["cat_name_id"])) {
    echo json_encode(["success" => false, "message" => "Ongeldige verwijdering"]);
    exit;
}

$userId = (int)$data["user_id"];
$catNameId = (int)$data["cat_name_id"];

if ($userId <= 0 || $catNameId <= 0) {
    echo json_encode(["success" => false, "message" => "Ongeldige gegevens"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        DELETE FROM cat_name_votes
        WHERE cat_name_id = ?
    ");
    $stmt->execute([$catNameId]);

    $stmt = $pdo->prepare("
        DELETE FROM selected_cat_names
        WHERE cat_name_id = ?
    ");
    $stmt->execute([$catNameId]);

    $stmt = $pdo->prepare("
        SELECT id
        FROM duo_names
        WHERE cat_name_1 = ? OR cat_name_2 = ?
    ");
    $stmt->execute([$catNameId, $catNameId]);
    $duoIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (!empty($duoIds)) {
        $placeholders = implode(",", array_fill(0, count($duoIds), "?"));

        $stmt = $pdo->prepare("
            DELETE FROM duo_name_votes
            WHERE duo_name_id IN ($placeholders)
        ");
        $stmt->execute($duoIds);

        $stmt = $pdo->prepare("
            DELETE FROM duo_names
            WHERE id IN ($placeholders)
        ");
        $stmt->execute($duoIds);
    }

    $stmt = $pdo->prepare("
        DELETE FROM cat_names
        WHERE id = ? AND submitted_by = ?
    ");
    $stmt->execute([$catNameId, $userId]);

    if ($stmt->rowCount() === 0) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Je mag deze naam niet verwijderen"]);
        exit;
    }

    $pdo->commit();

    echo json_encode(["success" => true, "message" => "Naam is verwijderd"]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => "Verwijderen mislukt: " . $e->getMessage()]);
}
