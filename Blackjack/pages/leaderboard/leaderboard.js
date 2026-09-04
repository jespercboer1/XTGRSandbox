const API =
    location.hostname === "localhost"
        ? "http://localhost/Blackjack/api"
        : "https://xtgrsandbox.nl/Blackjack/api";

const container = document.getElementById("main-container");

const STATS = {
    total_earned: "Total Earned",
    packs_opened: "Packs Opened",
    games_played: "Games Played",
    wins: "Wins",
    player_blackjacks: "Player Blackjacks",
    biggest_win: "Biggest Win",
    longest_win_streak: "Longest Win Streak"
};

let players = [];
let currentStat = "total_earned";

async function loadLeaderboard() {
    const res = await fetch(`${API}/get_leaderboard.php`);
    players = await res.json();

    render();
}

function render() {
    container.innerHTML = `
        <div class="content_container">
            <section>

                <div class="section-header">
                    <h1>Leaderboard</h1>
                    <p>Compare your statistics with other players.</p>
                </div>

                <div class="section-divider"></div>

                <div class="leaderboard-controls">
                    <label for="leaderboard-stat">Sort by</label>

                    <select id="leaderboard-stat">
                        ${Object.entries(STATS).map(([key, label]) => `
                            <option value="${key}" ${key === currentStat ? "selected" : ""}>
                                ${label}
                            </option>
                        `).join("")}
                    </select>
                </div>

                <div class="leaderboard-table">
                    <div id="leaderboard-table"></div>
                </div>

            </section>
        </div>
    `;

    document
        .getElementById("leaderboard-stat")
        .addEventListener("change", e => {
            currentStat = e.target.value;
            renderTable();
        });

    renderTable();
}

function renderTable() {
    const table = document.getElementById("leaderboard-table");

    const sorted = [...players].sort(
        (a, b) => Number(b[currentStat]) - Number(a[currentStat])
    );

    table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>${STATS[currentStat]}</th>
                </tr>
            </thead>

            <tbody>
                ${sorted.map((player, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${player.username}</td>
                        <td>${Number(player[currentStat]).toLocaleString()}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

loadLeaderboard();