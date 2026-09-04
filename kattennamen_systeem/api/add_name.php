<?php

require "db.php";

$data=json_decode(file_get_contents("php://input"),true);

$name=trim($data["name"]);
$name = ucwords(strtolower($name));
$user=$data["user_id"];

if($name==""){
    echo json_encode(["success"=>false,"message"=>"Naam is leeg"]);
    exit;
}

$stmt=$pdo->prepare("
SELECT COUNT(*)
FROM cat_names
WHERE LOWER(name)=LOWER(?)
");

$stmt->execute([$name]);

if($stmt->fetchColumn()>0){

    echo json_encode([
        "success"=>false,
        "message"=>"Deze naam bestaat al."
    ]);

    exit;
}

$stmt=$pdo->prepare("
INSERT INTO cat_names
(name,submitted_by)
VALUES(?,?)
");

$stmt->execute([
    $name,
    $user
]);

echo json_encode([
    "success"=>true
]);