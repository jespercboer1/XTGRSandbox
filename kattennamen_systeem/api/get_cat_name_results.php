<?php

require "db.php";

$stmt = $pdo->query("
    SELECT
        cr.cat_name_id,
        cn.name,
        cr.jesper_score,
        cr.elianne_score,
        cr.carin_score,
        cr.arjan_score,
        cr.average_score,
        CASE WHEN sc.cat_name_id IS NULL THEN 0 ELSE 1 END AS is_selected
    FROM cat_name_results cr
    JOIN cat_names cn ON cn.id = cr.cat_name_id
    LEFT JOIN selected_cat_names sc ON sc.cat_name_id = cr.cat_name_id
    ORDER BY cr.average_score DESC, cn.name ASC
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rows);
?>
