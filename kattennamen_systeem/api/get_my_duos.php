<?php

require "db.php";

$userId = isset($_GET["user_id"]) ? (int)$_GET["user_id"] : 0;

if ($userId <= 0) {
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT
        dn.id,
        dn.cat_name_1,
        dn.cat_name_2,
        cn1.name AS name_1,
        cn2.name AS name_2
    FROM duo_names dn
    JOIN cat_names cn1 ON cn1.id = dn.cat_name_1
    JOIN cat_names cn2 ON cn2.id = dn.cat_name_2
    WHERE dn.created_by = ?
    ORDER BY dn.id ASC
");

$stmt->execute([$userId]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
