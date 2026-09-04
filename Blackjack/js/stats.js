const API =
    location.hostname === "localhost"
        ? "http://localhost/Blackjack/api"
        : "https://xtgrsandbox.nl/Blackjack/api";

export async function addStat(stat, amount = 1) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await fetch(`${API}/update_stat.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, stat, amount })
    });
}