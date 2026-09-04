import { addStat } from "../js/stats.js"

// Card generation
let cardNumbers = [];
export function dealCards() {
    const playerCards = [drawCard(), drawCard()];
    const dealerCards = [drawCard(), drawCard()];

    return { playerCards, dealerCards };
}

export function drawCard() {
    const cards = [
        { suit: "club", rank: "1" }, { suit: "club", rank: "2" }, { suit: "club", rank: "3" },
        { suit: "club", rank: "4" }, { suit: "club", rank: "5" }, { suit: "club", rank: "6" },
        { suit: "club", rank: "7" }, { suit: "club", rank: "8" }, { suit: "club", rank: "9" },
        { suit: "club", rank: "10" }, { suit: "club", rank: "11" }, { suit: "club", rank: "12" },
        { suit: "club", rank: "13" },

        { suit: "diamond", rank: "1" }, { suit: "diamond", rank: "2" }, { suit: "diamond", rank: "3" },
        { suit: "diamond", rank: "4" }, { suit: "diamond", rank: "5" }, { suit: "diamond", rank: "6" },
        { suit: "diamond", rank: "7" }, { suit: "diamond", rank: "8" }, { suit: "diamond", rank: "9" },
        { suit: "diamond", rank: "10" }, { suit: "diamond", rank: "11" }, { suit: "diamond", rank: "12" },
        { suit: "diamond", rank: "13" },

        { suit: "heart", rank: "1" }, { suit: "heart", rank: "2" }, { suit: "heart", rank: "3" },
        { suit: "heart", rank: "4" }, { suit: "heart", rank: "5" }, { suit: "heart", rank: "6" },
        { suit: "heart", rank: "7" }, { suit: "heart", rank: "8" }, { suit: "heart", rank: "9" },
        { suit: "heart", rank: "10" }, { suit: "heart", rank: "11" }, { suit: "heart", rank: "12" },
        { suit: "heart", rank: "13" },

        { suit: "spade", rank: "1" }, { suit: "spade", rank: "2" }, { suit: "spade", rank: "3" },
        { suit: "spade", rank: "4" }, { suit: "spade", rank: "5" }, { suit: "spade", rank: "6" },
        { suit: "spade", rank: "7" }, { suit: "spade", rank: "8" }, { suit: "spade", rank: "9" },
        { suit: "spade", rank: "10" }, { suit: "spade", rank: "11" }, { suit: "spade", rank: "12" },
        { suit: "spade", rank: "13" }
    ];

    let cardNumber;

    do {
        cardNumber = Math.floor(Math.random() * cards.length);
    } while (cardNumbers.includes(cardNumber));

    cardNumbers.push(cardNumber);

    const card = cards[cardNumber];

    const value =
        card.rank === "1" ? 11 :
        Number(card.rank) >= 11 ? 10 :
        Number(card.rank);

    return { suit: card.suit, rank: card.rank, value };
}

export function dealerDrawCards(dealerCards) {
    let dealerTotal = calculateTotal(dealerCards);

    if (dealerTotal === 21) {
        addStat("dealer_blackjacks");
    }

    while (dealerTotal < 17) {
        dealerCards.push(drawCard());
        dealerTotal = calculateTotal(dealerCards);
    }

    console.log("Final dealerTotal:", dealerTotal);
}

export function resetCards() {
    cardNumbers = [];
}

// Rendering
export function renderCardImage(card, owner, index) {
    const alt = `${owner} ${card.rank} of ${card.suit}`;
    const ownerSlug = owner.toLowerCase();

    const selectable =
        ownerSlug === "player" && card.rank === "1"
            ? " selectable"
            : "";

    return `
        <img
            class="hand-card${selectable}"
            src="${getCardImageSrc(card)}"
            alt="${alt}"
            data-owner="${ownerSlug}"
            data-rank="${card.rank}"
            data-suit="${card.suit}"
            data-value="${card.value}"
            data-index="${index}"
        >
    `;
}

function getCardImageSrc(card) {
    const path = `assets/classic cards/${card.suit}/${card.rank}.png`;
    return encodeURI(path);
}

// Game status checks
export function checkBlackjack(hand) {
    const total = calculateTotal(hand);
    
    if (total === 21) {
        console.log("Blackjack! Total is 21.");
        return true;
    }
    console.log("Total is not 21, it's:", total);
    return false;
}

// Calculate total value of a hand
function getCardValue(card) {
    if (Number(card.rank) === 1) return 11;
    if (Number(card.rank) >= 11) return 10;
    return Number(card.rank);
}

export function calculateTotal(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
        const value = card.value ?? getCardValue(card);
        total += value;

        if (Number(card.rank) === 1) aces++;
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}