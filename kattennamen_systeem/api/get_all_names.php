<?php

require "db.php";

$stmt = $pdo->prepare("
    SELECT
    id,
    name
    FROM cat_names
    ORDER BY name
");


$stmt->execute();


echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC)
);

?>