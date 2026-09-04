<?php

require "db.php";


$data = json_decode(
    file_get_contents("php://input"),
    true
);


$user_id = $data["user_id"];
$passcode = $data["passcode"];


if(strlen($passcode) != 5 || !ctype_digit($passcode)){

    echo json_encode([
        "success" => false,
        "message" => "Ongeldige code"
    ]);

    exit;
}



$stmt = $pdo->prepare("
    UPDATE users
    SET 
        passcode = ?,
        passcode_created_at = NOW()
    WHERE id = ?
");


$stmt->execute([
    $passcode,
    $user_id
]);


echo json_encode([
    "success" => true
]);

?>