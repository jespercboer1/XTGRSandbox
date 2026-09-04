<?php

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data) || !isset($data["user_id"]) || !isset($data["votes"]) || !is_array($data["votes"])) {
    echo json_encode(["success" => false, "message" => "Ongeldige data"]);
    exit;
}

$userId = (int)$data["user_id"];
$votes = $data["votes"];

if ($userId <= 0) {
    echo json_encode(["success" => false, "message" => "Gebruiker onbekend"]);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO duo_name_votes (user_id, duo_name_id, rating)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE rating = VALUES(rating)
");

$success = true;

foreach ($votes as $vote) {
    $duoNameId = (int)($vote["duo_name_id"] ?? 0);
    $rating = (int)($vote["rating"] ?? 0);

    if ($duoNameId <= 0 || $rating < 1 || $rating > 5) {
        $success = false;
        break;
    }

    $stmt->execute([$userId, $duoNameId, $rating]);
}

if ($success) {
    echo json_encode(["success" => true, "message" => "Stemmen opgeslagen"]);
} else {
    echo json_encode(["success" => false, "message" => "Sommige scores zijn ongeldig"]);
}
?>
