<?php

require "db.php";

$checkStmt = $pdo->query("
    SELECT
        dn.id AS duo_name_id,
        COUNT(DISTINCT dnv.user_id) AS voted_by_count
    FROM duo_names dn
    LEFT JOIN duo_name_votes dnv ON dnv.duo_name_id = dn.id
    GROUP BY dn.id
    HAVING COUNT(DISTINCT dnv.user_id) < 4
    ORDER BY dn.id
");

$incomplete = $checkStmt->fetchAll(PDO::FETCH_ASSOC);

if (!empty($incomplete)) {
    echo json_encode([
        "success" => false,
        "message" => "Kan niet combineren: nog niet alle gebruikers hebben gestemd op alle duo's."
    ]);

    exit;
}

$stmt = $pdo->query("
    SELECT
        dn.id AS duo_name_id,
        MAX(CASE WHEN u.username = 'Jesper' THEN dnv.rating END) AS jesper_score,
        MAX(CASE WHEN u.username = 'Elianne' THEN dnv.rating END) AS elianne_score,
        MAX(CASE WHEN u.username = 'Carin' THEN dnv.rating END) AS carin_score,
        MAX(CASE WHEN u.username = 'Arjan' THEN dnv.rating END) AS arjan_score
    FROM duo_names dn
    LEFT JOIN duo_name_votes dnv ON dnv.duo_name_id = dn.id
    LEFT JOIN users u ON u.id = dnv.user_id
    GROUP BY dn.id
    ORDER BY dn.id
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$pdo->exec("DELETE FROM duo_name_results");

$insertResults = $pdo->prepare("
    INSERT INTO duo_name_results (
        duo_name_id,
        jesper_score,
        elianne_score,
        carin_score,
        arjan_score,
        average_score
    ) VALUES (?, ?, ?, ?, ?, ?)
");

$combined = 0;

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
        (int)$row["duo_name_id"],
        $row["jesper_score"] ?? null,
        $row["elianne_score"] ?? null,
        $row["carin_score"] ?? null,
        $row["arjan_score"] ?? null,
        $average
    ]);

    $combined++;
}

echo json_encode([
    "success" => true,
    "message" => "Samenvoegen voltooid voor $combined duo-resultaten.",
    "combined" => $combined
]);
?>
