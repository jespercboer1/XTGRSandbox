<?php

require "db.php";

$stmt = $pdo->query("
    SELECT
        cn.id AS cat_name_id,
        cn.name,
        u.id AS user_id,
        u.username,
        CASE WHEN cv.rating IS NULL THEN 0 ELSE 1 END AS has_vote
    FROM cat_names cn
    CROSS JOIN users u
    LEFT JOIN cat_name_votes cv ON cv.cat_name_id = cn.id AND cv.user_id = u.id
    ORDER BY cn.id, u.id
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$missingByName = [];
$allComplete = true;

foreach ($rows as $row) {
    $catNameId = (int)$row["cat_name_id"];
    $name = $row["name"];

    if (!isset($missingByName[$catNameId])) {
        $missingByName[$catNameId] = [
            "cat_name_id" => $catNameId,
            "name" => $name,
            "missing_users" => []
        ];
    }

    if ((int)$row["has_vote"] === 0) {
        $missingByName[$catNameId]["missing_users"][] = $row["username"];
        $allComplete = false;
    }
}

$missing = [];

foreach ($missingByName as $item) {
    if (!empty($item["missing_users"])) {
        $missing[] = $item;
    }
}

echo json_encode([
    "success" => true,
    "missing" => $missing,
    "all_complete" => $allComplete,
    "message" => $allComplete
        ? "Alle gebruikers hebben op alle kattennamen gestemd."
        : "Nog niet alle gebruikers hebben op alle kattennamen gestemd."
]);
?>
