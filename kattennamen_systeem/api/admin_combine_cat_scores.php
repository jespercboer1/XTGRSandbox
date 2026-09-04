<?php

require "db.php";

$checkStmt = $pdo->query("
    SELECT
        cn.id AS cat_name_id,
        cn.name,
        COUNT(DISTINCT cv.user_id) AS voted_by_count
    FROM cat_names cn
    LEFT JOIN cat_name_votes cv ON cv.cat_name_id = cn.id
    GROUP BY cn.id, cn.name
    HAVING COUNT(DISTINCT cv.user_id) < 4
    ORDER BY cn.id
");

$incomplete = $checkStmt->fetchAll(PDO::FETCH_ASSOC);

if (!empty($incomplete)) {
    $names = array_map(fn($row) => $row["name"], $incomplete);

    echo json_encode([
        "success" => false,
        "message" => "Kan niet combineren: nog niet alle gebruikers hebben gestemd op alle kattennamen.",
        "missing_names" => $names
    ]);

    exit;
}

$stmt = $pdo->query("
    SELECT
        cn.id AS cat_name_id,
        cn.name,
        MAX(CASE WHEN u.username = 'Jesper' THEN cv.rating END) AS jesper_score,
        MAX(CASE WHEN u.username = 'Elianne' THEN cv.rating END) AS elianne_score,
        MAX(CASE WHEN u.username = 'Carin' THEN cv.rating END) AS carin_score,
        MAX(CASE WHEN u.username = 'Arjan' THEN cv.rating END) AS arjan_score,
        MAX(CASE WHEN cv.rating = 1 THEN 1 ELSE 0 END) AS has_one
    FROM cat_names cn
    LEFT JOIN cat_name_votes cv ON cv.cat_name_id = cn.id
    LEFT JOIN users u ON u.id = cv.user_id
    GROUP BY cn.id, cn.name
    ORDER BY cn.id
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$pdo->exec("DELETE FROM cat_name_results");
$pdo->exec("DELETE FROM selected_cat_names");

$insertResults = $pdo->prepare("
    INSERT INTO cat_name_results (
        cat_name_id,
        jesper_score,
        elianne_score,
        carin_score,
        arjan_score,
        average_score
    ) VALUES (?, ?, ?, ?, ?, ?)
");

$insertSelected = $pdo->prepare("
    INSERT INTO selected_cat_names (cat_name_id)
    VALUES (?)
");

$combined = 0;
$selected = 0;

foreach ($rows as $row) {
    $scores = [
        (int)$row["jesper_score"],
        (int)$row["elianne_score"],
        (int)$row["carin_score"],
        (int)$row["arjan_score"]
    ];

    $validScores = array_values(array_filter($scores, fn($score) => $score > 0));
    $average = count($validScores) > 0 ? round(array_sum($validScores) / count($validScores), 2) : 0;

    $insertResults->execute([
        (int)$row["cat_name_id"],
        $row["jesper_score"] ?? null,
        $row["elianne_score"] ?? null,
        $row["carin_score"] ?? null,
        $row["arjan_score"] ?? null,
        $average
    ]);

    if ((int)$row["has_one"] === 0) {
        $insertSelected->execute([(int)$row["cat_name_id"]]);
        $selected++;
    }

    $combined++;
}

echo json_encode([
    "success" => true,
    "message" => "Samenvoegen voltooid voor $combined kattennaamresultaten. $selected namen geselecteerd.",
    "combined" => $combined,
    "selected" => $selected
]);
?>
