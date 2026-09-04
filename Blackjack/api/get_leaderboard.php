<?php
header("Content-Type: application/json");

require "bootstrap.php";
require "db.php";

$sql = "
SELECT
    u.id,
    u.username,

    COALESCE(MAX(CASE WHEN us.stat_code='total_earned' THEN us.value END),0) AS total_earned,
    COALESCE(MAX(CASE WHEN us.stat_code='packs_opened' THEN us.value END),0) AS packs_opened,
    COALESCE(MAX(CASE WHEN us.stat_code='games_played' THEN us.value END),0) AS games_played,
    COALESCE(MAX(CASE WHEN us.stat_code='wins' THEN us.value END),0) AS wins,
    COALESCE(MAX(CASE WHEN us.stat_code='player_blackjacks' THEN us.value END),0) AS player_blackjacks,
    COALESCE(MAX(CASE WHEN us.stat_code='biggest_win' THEN us.value END),0) AS biggest_win,
    COALESCE(MAX(CASE WHEN us.stat_code='longest_win_streak' THEN us.value END),0) AS longest_win_streak

FROM users u

LEFT JOIN user_stats us
    ON us.user_id = u.id

GROUP BY
    u.id,
    u.username

ORDER BY
    u.username;
";

$stmt = $pdo->query($sql);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));