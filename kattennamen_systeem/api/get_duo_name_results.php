<?php

require "db.php";

$stmt = $pdo->query("
    SELECT
        dnr.duo_name_id,
        CONCAT(cn1.name, ' + ', cn2.name) AS name,
        dnr.jesper_score,
        dnr.elianne_score,
        dnr.carin_score,
        dnr.arjan_score,
        dnr.average_score,
        CASE
            WHEN dnr.jesper_score = 1 OR dnr.elianne_score = 1 OR dnr.carin_score = 1 OR dnr.arjan_score = 1 THEN 1
            ELSE 0
        END AS has_one
    FROM duo_name_results dnr
    JOIN duo_names dn ON dn.id = dnr.duo_name_id
    JOIN cat_names cn1 ON cn1.id = dn.cat_name_1
    JOIN cat_names cn2 ON cn2.id = dn.cat_name_2
    ORDER BY
        CASE
            WHEN dnr.jesper_score = 1 OR dnr.elianne_score = 1 OR dnr.carin_score = 1 OR dnr.arjan_score = 1 THEN 1
            ELSE 0
        END ASC,
        dnr.average_score DESC,
        name ASC
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rows);
?>
