<?php

$isLocal = in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1']);

if ($isLocal) {
    // Local XAMPP
    $host = "localhost";
    $dbname = "kattennamen_systeem";
    $username = "root";
    $password = "";
} else {
    // Live hosting
    $host = "localhost";
    $dbname = "sr125551_kattennamen_systeem";
    $username = "sr125551_admin";
    $password = "bOhu8m2M";
}

try {

    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch(PDOException $e){

    die(json_encode([
        "error" => $e->getMessage()
    ]));

}

?>