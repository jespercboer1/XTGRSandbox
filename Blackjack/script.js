const scriptAPI =
    location.hostname === "localhost"
        ? "http://localhost/Blackjack/api"
        : "https://xtgrsandbox.nl/Blackjack/api";

function getCurrentUserId() {
    return localStorage.getItem("userId");
}

async function loadMoney() {
    const money = getCurrentUserId();

    const res = await fetch(`${scriptAPI}/get_money.php?id=${encodeURIComponent(money)}`);
    const user = await res.json();

    setMoney(user);
}

function setMoney(user) {
    const moneyElement = document.getElementById("money");
    if (moneyElement) {
        moneyElement.textContent = `$${user.money.toLocaleString()}`;
    }
}

function go(path) {
    window.location.href = "/Blackjack/" + path;
}

document.getElementById("blackjack-title").addEventListener("click", () => {
    go("index.html");
});

document.getElementById("play-button").addEventListener("click", () => {
    go("index.html");
});

document.getElementById("shop-button").addEventListener("click", () => {
    go("pages/shop/shop.html");
});

document.getElementById("deck-button").addEventListener("click", () => {
    go("pages/deck/deck.html");
});

document.getElementById("statistics-button").addEventListener("click", () => {
    go("pages/statistics/statistics.html");
});

document.getElementById("achievements-button").addEventListener("click", () => {
    go("pages/achievements/achievements.html");
});

document.getElementById("leaderboard-button").addEventListener("click", () => {
    go("pages/leaderboard/leaderboard.html");
});

document.getElementById("rules-button").addEventListener("click", () => {
    go("pages/rules/rules.html");
});

document.getElementById("about-button").addEventListener("click", () => {
    go("pages/about/about.html");
});

document.getElementById("settings-button").addEventListener("click", () => {
    go("pages/settings/settings.html");
});

document.getElementById("profile-button").addEventListener("click", () => {
    go("pages/profile/profile.html");
});

document.getElementById("footer-container").innerHTML = `
    <p>&copy; 2026 XTGRSandbox. All rights reserved.</p>
`;

loadMoney();