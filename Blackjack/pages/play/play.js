import { dealCards, drawCard, renderCardImage, checkBlackjack, calculateTotal, dealerDrawCards, resetCards } from "../../js/core.js";
import { addStat } from "../../js/stats.js";

const API =
    location.hostname === "localhost"
        ? "http://localhost/Blackjack/api"
        : "https://xtgrsandbox.nl/Blackjack/api";

const container = document.getElementById("main-container");
let currentUserId = localStorage.getItem("userId");
let seenIntro = 0;
let isRoundOver = false;
let gameState;
let isAnimating = false;

async function getSeenIntro() {
    const id = getCurrentUserId();
    if (!id) return 0;

    const res = await fetch(`${API}/get_seenIntro.php?id=${encodeURIComponent(id)}`);
    const data = await res.json();

    return Number(data.seen_intro ?? 0);
}

function getCurrentUserId() {
    return localStorage.getItem("userId");
}

// Intro screen
function showIntro() {
    container.innerHTML = `
        <div id="game-intro" class="content_container">
            <div id="game-intro-left">

                <section>
                    <h1>Welcome to Blackjack</h1>
                    <p>
                        Welcome to <span class="accent">Blackjack</span>, a simple browser-based card game
                        where every decision matters. Your goal is to beat the dealer by getting as close to
                        <span class="score-best">21</span> as possible without going over.
                    </p>
                </section>

                <section>
                    <h2>Website Navigation</h2>
                    <p><span class="nav-item">Play</span> — Start a new game</p>
                    <p><span class="nav-item">Shop</span> — Cosmetics and unlockables</p>
                    <p><span class="nav-item">Statistics</span> — Your win/loss history</p>
                    <p><span class="nav-item">Achievements</span> — Completed challenges</p>
                    <p><span class="nav-item">Leaderboard</span> — Compare scores with others</p>
                    <p><span class="nav-item">Rules</span> — Full game rules</p>
                    <p><span class="nav-item">About</span> — Project information</p>
                    <p><span class="nav-item">Settings</span> — Customize your experience</p>
                </section>

            </div>

            <div id="game-intro-right">

                <section>
                    <h2>How to Play</h2>
                    <p>At the start of each round, you and the dealer receive cards. Your goal is to build a stronger hand.</p>
                    <p><span class="action-hit" disabled>Hit</span> — Draw another card.</p>
                    <p><span class="action-stand" disabled>Stand</span> — Keep your current hand.</p>
                    <p>Number cards are worth their face value. <span class="card-face">Jacks, Queens, and Kings</span> are worth
                        <span class="score-mid">10</span>. An <span class="card-ace">Ace</span> counts as
                        <span class="score-low">1 or 11</span>.</p>
                    <p>If your total exceeds <span class="score-bust">21</span>, you bust and lose automatically.</p>
                </section>

                <section>
                    <h2>Ready to Play?</h2>
                    <p>Click the button below to start.</p>
                    <button id="play-button" class="btn-primary">Play</button>
                    <br>
                    <p>Or log-in to save your progress!</p>
                    <button id="profile-button" class="btn-secondary">Log-in</button>
                </section>

            </div>
        </div>
    `;
}

// timing for animations and delays
const CARD_ANIMATION = {
    flipDurationMs: 200,
    initialDealDelayMs: 10,
    initialDealStaggerMs: 100,
    hitFlipDelayMs: 10,
    dealerHiddenFlipDelayMs: 10,
    dealerDrawStartDelayMs: 300,
    dealerDrawStaggerMs: 200,
    flipInitDelayMs: 10,
};

// get back of card image source
function getCardBackSrc() {
    return encodeURI("assets/classic cards/back/Blue Stone.png");
}

// Button management
function disableButtons() {
    isAnimating = true;
    const hitBtn = document.getElementById("hit-button");
    const standBtn = document.getElementById("stand-button");
    if (hitBtn) hitBtn.disabled = true;
    if (standBtn) standBtn.disabled = true;
}

function enableButtons() {
    isAnimating = false;
    const hitBtn = document.getElementById("hit-button");
    const standBtn = document.getElementById("stand-button");
    if (hitBtn && !isRoundOver) hitBtn.disabled = false;
    if (standBtn && !isRoundOver) standBtn.disabled = false;
}

// animations
function renderFlippingCard(card, owner, index, isFaceUp = false) {
    const ownerSlug = owner.toLowerCase();
    const frontImage = renderCardImage(card, owner, index);
    return `
        <div class="card-flip-wrapper" data-owner="${ownerSlug}" data-index="${index}">
            <div class="card-flipper${isFaceUp ? " flipped" : ""}">
                <div class="card-face card-back">
                    <img src="${getCardBackSrc()}" alt="Card back">
                </div>
                <div class="card-face card-front">
                    ${frontImage}
                </div>
            </div>
        </div>
    `;
}

document.addEventListener("load", (e) => {
    if (!e.target.matches(".card-face img")) return;

    const img = e.target;
    const wrapper = img.closest(".card-flip-wrapper");

    if (!wrapper) return;

    const width = img.naturalWidth * (220 / img.naturalHeight);
    wrapper.style.width = `${width}px`;
}, true);

function flipCard(wrapper) {
    const flipper = wrapper?.querySelector(".card-flipper");
    if (flipper) {
        requestAnimationFrame(() => {
            setTimeout(() => flipper.classList.add("flipped"), CARD_ANIMATION.flipInitDelayMs);
        });
    }
}

function animateInitialDeal() {
    disableButtons();
    const cardWrappers = document.querySelectorAll("#player-hand .card-flip-wrapper, #dealer-hand .card-flip-wrapper[data-index=\"1\"]");
    cardWrappers.forEach((wrapper, index) => {
        setTimeout(
            () => flipCard(wrapper),
            CARD_ANIMATION.initialDealDelayMs + index * CARD_ANIMATION.initialDealStaggerMs
        );
    });
    
    // Re-enable buttons after all initial cards are dealt
    const totalInitialAnimationTime = CARD_ANIMATION.initialDealDelayMs + (cardWrappers.length - 1) * CARD_ANIMATION.initialDealStaggerMs + CARD_ANIMATION.flipDurationMs;
    setTimeout(() => enableButtons(), totalInitialAnimationTime);
}

// Game screen
function showGame() {
    isRoundOver = false;
    const { playerCards, dealerCards } = dealCards();
    gameState = { playerCards, dealerCards };
    const backCard = { suit: "back", rank: "Blue Stone" }; // Placeholder for dealer's hidden card

    const playerTotal = calculateTotal(gameState.playerCards);

    console.log("Player's Cards:", playerCards);
    console.log("Dealer's Cards:", dealerCards);
    container.innerHTML = `
    <div id="game-container" class="content_container">
        <section id="dealer-hand">
            <h2 id="dealer-hand-title">Dealer's Hand -- (?)</h2>
            <div class="hand-cards">
                ${renderFlippingCard(backCard, "Dealer", 0, false)}
                ${renderFlippingCard(dealerCards[1], "Dealer", 1)}
            </div>
        </section>

        <section id="player-hand">
            <h2 id="player-hand-title">Player's Hand -- (${playerTotal})</h2>
            <div class="hand-cards">
                ${renderFlippingCard(playerCards[0], "Player", 0)}
                ${renderFlippingCard(playerCards[1], "Player", 1)}
            </div>
        </section>

        <section id="game-action-controls" class="no-title">
            <div id="action-buttons" class="buttons">
                <button id="hit-button" class="btn-hit">Hit</button>
                <button id="stand-button" class="btn-stand">Stand</button>
                <button id="play-again-button" class="btn-primary">Play Again</button>
            </div>
            <div id="game-message-container">    
                <p id="game-message">Your choice! Hit or stand?</p>
            </div>
        </section>
    </div>
    `;

    const playAgain = document.getElementById("play-again-button");
    const hitBtn = document.getElementById("hit-button");
    const standBtn = document.getElementById("stand-button");

    playAgain.style.display = "none";
    hitBtn.style.display = "inline-block";
    standBtn.style.display = "inline-block";

    const isBlackjack = checkBlackjack(gameState.playerCards);

    if (isBlackjack) {
        let endClass;
        const dealerBlackjack = checkBlackjack(gameState.dealerCards);
        if (dealerBlackjack) {
            addStat("blackjack_ties");
            addStat("dealer_blackjacks");
            addStat("player_blackjacks");
            addStat("ties");
            endGame("win-screen", "Both have Blackjack! It's a tie!");
        } else {
            addStat("player_blackjacks");
            addStat("wins");
            endGame("win-screen", "Blackjack! You win!");
        }
    }

    requestAnimationFrame(animateInitialDeal);
}

// Event delegation (works for both screens)
container.addEventListener("click", (e) => {
    if (e.target.id === "play-button") {
        addStat("seen_intro");
        showGame();
    }

    if (e.target.id === "profile-button") {
        window.location.href = "pages/profile/profile.html";
    }

    if (e.target.id === "hit-button") {
        if (isAnimating || isRoundOver) return;
        
        console.log("Hit");
        addStat("hits");

        disableButtons();
        gameState.playerCards.push(drawCard());

        const newIndex = gameState.playerCards.length - 1;
        const newCard = gameState.playerCards[newIndex];

        const html = renderFlippingCard(newCard, "Player", newIndex);
        const playerCardsNode = document.querySelector("#player-hand .hand-cards");
        playerCardsNode.insertAdjacentHTML("beforeend", html);
        const inserted = playerCardsNode.querySelector(`.card-flip-wrapper[data-index="${newIndex}"]`);
        if (inserted) {
            setTimeout(() => flipCard(inserted), CARD_ANIMATION.hitFlipDelayMs);
            setTimeout(() => enableButtons(), CARD_ANIMATION.hitFlipDelayMs + CARD_ANIMATION.flipDurationMs);
        }

        const playerTotal = calculateTotal(gameState.playerCards);
        const dealerTotal = calculateTotal(gameState.dealerCards);

        document.getElementById("player-hand-title").textContent = `Player's Hand -- (${playerTotal})`;
        console.log(playerTotal);

        const isBlackjack = checkBlackjack(gameState.playerCards);

        let endClass;
        if (isBlackjack) {
            dealerDrawCards(gameState.dealerCards);
            const dealerBlackjack = checkBlackjack(gameState.dealerCards);
            if (dealerTotal > 21) {
                addStat("dealer_busts");
                addStat("wins");
                endGame("win-screen", "Dealer busts! You win!");
            } else if (dealerBlackjack) {
                addStat("ties");
                endGame("tie-screen", "Both have 21! It's a tie!");
            } else {
                addStat("wins");
                endGame("win-screen", "21! You win!");
            }
        } else if (playerTotal > 21) {
            addStat("losses");
            addStat("player_busts");
            endGame("lose-screen", "bust! You lose!");
        }
    }

    if (e.target.id === "stand-button") {
        if (isAnimating || isRoundOver) return;
        
        console.log("Stand");
        addStat("stands");

        disableButtons();
        dealerDrawCards(gameState.dealerCards);

        const playerTotal = calculateTotal(gameState.playerCards);
        const dealerTotal = calculateTotal(gameState.dealerCards);

        let endClass;
        if (dealerTotal > 21) {
            addStat("dealer_busts");
            addStat("wins");
            endGame("win-screen", "Dealer busts! You win!");
        } else if (playerTotal > dealerTotal) {
            addStat("wins");
            endGame("win-screen", "You win!");
        } else if (playerTotal < dealerTotal) {
            addStat("losses");
            endGame("lose-screen", "You lose!");
        } else {
            addStat("ties");
            endGame("tie-screen", "It's a tie!");
        }
    }
    
    if (e.target.id === "play-again-button") {
        if (isAnimating) return;

        const playAgain = document.getElementById("play-again-button");
        const hitBtn = document.getElementById("hit-button");
        const standBtn = document.getElementById("stand-button");

        playAgain.style.display = "none";
        hitBtn.style.display = "inline-block";
        standBtn.style.display = "inline-block";
        hitBtn.disabled = false;
        standBtn.disabled = false;
        
        resetCards();
        showGame();
    }
});

function revealDealerCards() {
    isRoundOver = true;
    disableButtons();
    const dealerHandCards = document.querySelector("#dealer-hand .hand-cards");
    if (!dealerHandCards) return;

    const hiddenWrapper = dealerHandCards.querySelector(".card-flip-wrapper[data-owner='dealer'][data-index='0']");
    if (hiddenWrapper) {
        const realHiddenHtml = renderFlippingCard(gameState.dealerCards[0], "Dealer", 0, false);
        hiddenWrapper.outerHTML = realHiddenHtml;
        const newHidden = dealerHandCards.querySelector(".card-flip-wrapper[data-owner='dealer'][data-index='0']");
        if (newHidden) {
            setTimeout(() => flipCard(newHidden), CARD_ANIMATION.dealerHiddenFlipDelayMs);
        }
    }

    const extraDealerCards = gameState.dealerCards.slice(2);
    if (extraDealerCards.length === 0) {
        // No extra cards, just enable buttons after hidden card flip
        setTimeout(() => enableButtons(), CARD_ANIMATION.dealerHiddenFlipDelayMs + CARD_ANIMATION.flipDurationMs);
        return;
    }

    let lastAnimationTime = CARD_ANIMATION.dealerHiddenFlipDelayMs + CARD_ANIMATION.flipDurationMs;
    
    extraDealerCards.forEach((card, extraIndex) => {
        const cardIndex = extraIndex + 2;
        const cardAnimationTime = CARD_ANIMATION.dealerDrawStartDelayMs + extraIndex * CARD_ANIMATION.dealerDrawStaggerMs;
        
        setTimeout(() => {
            const cardHtml = renderFlippingCard(card, "Dealer", cardIndex, false);
            dealerHandCards.insertAdjacentHTML("beforeend", cardHtml);
            const inserted = dealerHandCards.querySelector(`.card-flip-wrapper[data-index="${cardIndex}"]`);
            if (inserted) {
                setTimeout(() => flipCard(inserted), CARD_ANIMATION.flipInitDelayMs);
            }
        }, cardAnimationTime);
        
        lastAnimationTime = Math.max(lastAnimationTime, cardAnimationTime + CARD_ANIMATION.flipDurationMs);
    });
    
    // Re-enable buttons after all dealer animations complete
    setTimeout(() => enableButtons(), lastAnimationTime);
}

function endRound() {
    addStat("games_played");

    const playAgain = document.getElementById("play-again-button");
    const hitBtn = document.getElementById("hit-button");
    const standBtn = document.getElementById("stand-button");

    playAgain.style.display = "inline-block";
    hitBtn.style.display = "none";
    standBtn.style.display = "none";
}

function renderGameResult(screen) {
    const dealerHand = document.getElementById("dealer-hand");
    const playerHand = document.getElementById("player-hand");
    const gameControls = document.getElementById("game-action-controls");

    dealerHand.classList.add(screen);
    playerHand.classList.add(screen);
    gameControls.classList.add(screen);
}

function endGame(endClass, message) {
    const playerTotal = calculateTotal(gameState.playerCards);
    const dealerTotal = calculateTotal(gameState.dealerCards);

    document.getElementById("game-message").textContent = message;
    document.getElementById("dealer-hand-title").textContent = `Dealer's Hand -- (${dealerTotal})`;
    console.log(endClass);
    
    revealDealerCards();
    endRound();
    renderGameResult(endClass);
}

async function init() {
    seenIntro = await getSeenIntro();

    if (Number(seenIntro) === 0) {
        showIntro();
    } else {
        showGame();
    }
}

init();