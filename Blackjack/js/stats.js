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

export async function addMoney(amount) {
    console.log(amount);

    let money = localStorage.getItem("money");
    let newMoney = parseInt(money) + amount;
    localStorage.setItem("money", newMoney);

    console.log(newMoney);

    const moneyElement = document.getElementById("money");
    if (moneyElement) {
        moneyElement.textContent = `$${newMoney.toLocaleString()}`;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await fetch(`${API}/update_money.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, newMoney })
    });
}