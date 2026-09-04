<?php

require "db.php";

$user=$_GET["user_id"];

$stmt=$pdo->prepare("
SELECT
id,
name
FROM cat_names
WHERE submitted_by=?
ORDER BY name
");

$stmt->execute([$user]);

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC)
);