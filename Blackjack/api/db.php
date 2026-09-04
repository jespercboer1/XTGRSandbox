<?php

$isLocal = in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1']);

if ($isLocal) {
    // Local XAMPP
    $host = "localhost";
    $dbname = "blackjack";
    $username = "root";
    $password = "";
} else {
    // Live hosting
    $host = "localhost";
    $dbname = "sr125551_Blackjack";
    $username = "sr125551_admin";
    $password = "bOhu8m2M";
}

$pdo = new PDO(
    "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
    $username,
    $password
);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);