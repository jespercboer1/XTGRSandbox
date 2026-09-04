<?php

require "db.php";

$stmt = $pdo->query("
    SELECT
        dn.id,
        dn.cat_name_1,
        dn.cat_name_2,
        cn1.name AS name_1,
        cn2.name AS name_2
    FROM duo_names dn
    JOIN cat_names cn1 ON cn1.id = dn.cat_name_1
    JOIN cat_names cn2 ON cn2.id = dn.cat_name_2
    ORDER BY dn.id ASC
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rows);
?>
