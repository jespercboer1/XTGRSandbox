import random

# ---------- SETTINGS ----------

STARTING_MONEY = 1000
BET = 100
HANDS = 100

# Probabilities (must total 1.0)
LOSS_CHANCE = 0.49
TIE_CHANCE = 0.09
BLACKJACK_CHANCE = 0.04
WIN_CHANCE = 1 - LOSS_CHANCE - TIE_CHANCE - BLACKJACK_CHANCE

# ------------------------------

money = STARTING_MONEY

win_streak = 0
loss_streak = 0

stats = {
    "loss": 0,
    "tie": 0,
    "win": 0,
    "blackjack": 0
}

for _ in range(HANDS):

    r = random.random()

    if r < LOSS_CHANCE:
        outcome = "loss"
    elif r < LOSS_CHANCE + TIE_CHANCE:
        outcome = "tie"
    elif r < LOSS_CHANCE + TIE_CHANCE + BLACKJACK_CHANCE:
        outcome = "blackjack"
    else:
        outcome = "win"

    money -= BET

    if outcome == "loss":
        payout = min(0.2 * loss_streak, 1.0)

        money += BET * payout

        loss_streak += 1
        win_streak = 0

    elif outcome == "tie":
        money += BET

        win_streak = 0
        loss_streak = 0

    elif outcome == "win":
        payout = min(2.0 + 0.2 * win_streak, 3.0)

        money += BET * payout

        win_streak += 1
        loss_streak = 0

    elif outcome == "blackjack":
        payout = min(2.5 + 0.2 * win_streak, 3.5)

        money += BET * payout

        win_streak += 1
        loss_streak = 0

    stats[outcome] += 1

print("Results")
print("----------------")
print(f"Money: {money:.2f}")
print(f"Profit: {money - STARTING_MONEY:.2f}")
print()

for k, v in stats.items():
    print(f"{k:10}: {v}")