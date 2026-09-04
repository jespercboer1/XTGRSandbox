<?php

require "db.php";

$stmt = $pdo->query("
    SELECT
        dn.id AS duo_name_id,
        CONCAT(cn1.name, ' + ', cn2.name) AS duo_name,
        u.id AS user_id,
        u.username,
        CASE WHEN dnv.rating IS NULL THEN 0 ELSE 1 END AS has_vote
    FROM duo_names dn
    JOIN cat_names cn1 ON cn1.id = dn.cat_name_1
    JOIN cat_names cn2 ON cn2.id = dn.cat_name_2
    CROSS JOIN users u
    LEFT JOIN duo_name_votes dnv ON dnv.duo_name_id = dn.id AND dnv.user_id = u.id
    ORDER BY dn.id, u.id
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$missingByDuo = [];
$allComplete = true;

foreach ($rows as $row) {
    $duoNameId = (int)$row["duo_name_id"];
    $duoName = $row["duo_name"];

    if (!isset($missingByDuo[$duoNameId])) {
        $missingByDuo[$duoNameId] = [
            "duo_name_id" => $duoNameId,
            "name" => $duoName,
            "missing_users" => []
        ];
    }

    if ((int)$row["has_vote"] === 0) {
        $missingByDuo[$duoNameId]["missing_users"][] = $row["username"];
        $allComplete = false;
    }
}

$missing = [];

foreach ($missingByDuo as $item) {
    if (!empty($item["missing_users"])) {
        $missing[] = $item;
    }
}

echo json_encode([
    "success" => true,
    "missing" => $missing,
    "all_complete" => $allComplete,
    "message" => $allComplete
        ? "Alle gebruikers hebben op alle duo's gestemd."
        : "Nog niet alle gebruikers hebben op alle duo's gestemd."
]);
?>
