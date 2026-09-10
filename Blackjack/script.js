const scriptAPI =
    location.hostname === "localhost"
        ? "http://localhost/Blackjack/api"
        : "https://xtgrsandbox.nl/Blackjack/api";

function getCurrentUserId() {
    return localStorage.getItem("userId");
}

async function loadMoney() {
    const userId = getCurrentUserId();

    if (userId) {
        try {
            const res = await fetch(`${scriptAPI}/get_money.php?id=${encodeURIComponent(userId)}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const user = await res.json();
            setMoney(user);
            return;
        } catch (err) {
            console.error('Error fetching money for user:', err);
        }
    }

    // If not logged in or fetch failed, use localStorage or default to 1000
    const stored = localStorage.getItem("money");
    const amount = stored ? parseInt(stored, 10) : 1000;
    setMoney(amount);
}

function setMoney(user) {
    const moneyElement = document.getElementById("money");
    let amount = 1000;
    if (user && typeof user === 'object' && 'money' in user) {
        amount = Number(user.money) || 1000;
    } else {
        amount = Number(user) || 1000;
    }

    if (moneyElement) {
        moneyElement.textContent = `$${amount.toLocaleString()}`;
    }
    localStorage.setItem("money", amount);
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