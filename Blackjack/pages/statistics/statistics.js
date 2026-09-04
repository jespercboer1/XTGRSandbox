const API =
    location.hostname === "localhost"
        ? "http://localhost/Blackjack/api"
        : "https://xtgrsandbox.nl/Blackjack/api";

const container = document.getElementById("main_container");

/* -----------------------------
   EXACT ORDERED CATEGORIES
----------------------------- */
const CATEGORIES = [
    {
        title: "Core performance stats",
        stats: [
            "games_played",
            "wins","losses","ties", // virtual (rendered)
            "win_rate",
            "loss_rate",
            "tie_rate"
        ]
    },
    {
        title: "Blackjack-specific stats",
        stats: [
            "player_blackjacks",
            "dealer_blackjacks",
            "blackjack_ties",
            "blackjack_win_rate",
            "dealer_busts",
            "player_busts",
            "dealer_bust_percentage",
            "player_bust_percentage",
            "most_common_outcome (comming soon)"
        ]
    },
    {
        title: "Gameplay behavior stats",
        stats: [
            "hits",
            "stands",
            "splits",
            "double_downs",
            "surrenders",
            "hit_stand_ratio"
        ]
    },
    {
        title: "Economy / progression",
        stats: [
            "money",
            "total_earned",
            "total_spent",
            "highest_balance",
            "biggest_win",
            "biggest_loss",
        ]
    },
    {
        title: "Luck / RNG stats",
        stats: [
            "longest_win_streak (comming soon)",
            "longest_loss_streak (comming soon)",
            "current_streak (comming soon)",
        ]
    },
];

/* -----------------------------
   DERIVED STATS
----------------------------- */
function calc(stats) {
    const games = stats.games_played || 0;

    const wins = stats.wins || 0;
    const losses = stats.losses || 0;
    const ties = stats.ties || 0;

    const playerBlackjacks = stats.player_blackjacks || 0;
    const dealerBlackjacks = stats.dealer_blackjacks || 0;
    const blackjackTies = stats.blackjack_ties || 0

    const hits = stats.hits || 0;
    const stands = stats.stands || 0;

    const totalEarned = stats.total_earned || 0;
    const totalSpent = stats.total_spent || 0;

    const playerBusts = stats.player_busts || 0;
    const dealerBusts = stats.dealer_busts || 0;

    return {
        /* ---------------- CORE RATES ---------------- */

        win_rate: games ? (wins / games) * 100 : 0,
        loss_rate: games ? (losses / games) * 100 : 0,
        tie_rate: games ? (ties / games) * 100 : 0,

        /* ---------------- BLACKJACK ---------------- */

        blackjack_win_rate: playerBlackjacks
            ? (playerBlackjacks - blackjackTies) / playerBlackjacks * 100
            : 0,

        dealer_bust_percentage: games
            ? (dealerBusts / games) * 100
            : 0,

        player_bust_percentage: games
            ? (playerBusts / games) * 100
            : 0,

        /* ---------------- GAMEPLAY ---------------- */

        hit_stand_ratio: stands
            ? (hits / stands).toFixed(2)
            : "0.00",

        /* ---------------- ECONOMY ---------------- */

        net_profit: totalEarned - totalSpent
    };
}

/* -----------------------------
   LOAD
----------------------------- */
async function loadStats() {
    const id = localStorage.getItem("userId");

    if (!id) {
        renderLogin();
        return;
    }

    const res = await fetch(`${API}/get_stats.php?id=${id}`);
    const stats = await res.json();

    if (!stats || stats.error) {
        renderLogin();
        return;
    }

    renderStats(stats);
}

/* -----------------------------
   LOGIN SCREEN
----------------------------- */
function renderLogin() {
    container.innerHTML = `
        <div class="content_container">
            <section class="stats-section">
                <h1>Statistics</h1>
                <p>Log in to view your statistics.</p>
            </section>
        </div>
    `;
}

/* -----------------------------
   MAIN RENDER
----------------------------- */
function renderStats(stats) {
    const derived = calc(stats);

    const used = new Set();

    const html = CATEGORIES.map(cat => {
        const body = cat.stats.map(key => {
            used.add(key);

            const value = getStatValue(stats, derived, key);

            return statCard(key, value);
        }).join("");

        return section(cat.title, body);
    }).join("");

    /* -----------------------------
       EXTRA STATS (NOT SHOWN ABOVE)
    ----------------------------- */
    const extra = Object.keys(stats)
        .filter(k => k !== "user_id" && !used.has(k))
        .map(k => statCard(k, stats[k]))
        .join("");

    container.innerHTML = `
        <div id="stats-container" class="content_container">
        
            ${html}

            ${extra ? section("Extra stats", extra) : ""}

        </div>
    `;
}

/* -----------------------------
   VALUE RESOLVER
----------------------------- */
function getStatValue(stats, derived, key) {
    if (derived[key] !== undefined) return derived[key];

    return stats[key] ?? 0;
}

/* -----------------------------
   UI HELPERS
----------------------------- */
function section(title, content) {
    return `
        <section>
            <h2>${title}</h2>
            <div class="stats-grid">
                ${content}
            </div>
        </section>
    `;
}

function statCard(key, value) {
    return `
        <div class="stat-card">
            <div class="stat-label">${formatKey(key)}</div>
            <div class="section-divider"></div>
            <div class="stat-value">${formatValue(value)}</div>
        </div>
    `;
}

function formatKey(key) {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}

function formatValue(value) {
    if (typeof value !== "number") return value;

    return Number(value.toFixed(2));
}

/* -----------------------------
   START
----------------------------- */
loadStats();