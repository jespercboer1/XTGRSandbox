<?php

require "db.php";

$stmt = $pdo->query("
    SELECT
        sc.cat_name_id,
        cn.name
    FROM selected_cat_names sc
    JOIN cat_names cn ON cn.id = sc.cat_name_id
    ORDER BY sc.cat_name_id ASC
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rows);
?>
