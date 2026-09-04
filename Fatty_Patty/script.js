import { price, amount } from './values.js';

// html items
const newOrders = document.getElementById("newOrders");
const pendingOrders = document.getElementById("pendingOrders");
const clock = document.getElementById("clock");
const nextOrderTimer = document.getElementById("nextOrderTimer");
const grillContainer = document.getElementById("grillContainer");
const openRestaurantButton = document.getElementById("openRestaurantButton");
const openComputerButton = document.getElementById("openComputerButton");
const computerScreen = document.getElementById("computerScreen");
const closeComputerScreen = document.getElementById("closeComputerScreen");
const openShopButton = document.getElementById("openShopButton");
const shopScreen = document.getElementById("shopScreen");
const closeShopButton = document.getElementById("closeShopButton");
const openStorageButton = document.getElementById("openStorageButton");
const storageScreen = document.getElementById("storageScreen");
const closeStorageButton = document.getElementById("closeStorageButton");
const moneyDiv = document.getElementById("money");
const storage = document.getElementById("storage");
const giveMoney = document.getElementById("giveMoney");

// order options
const bunOptions = ["White", "Brown", "Sesame", "Brioche"];
const pattyOptions = [1, 2, 3];
const cheeseOptions = [0, 1, 2];
const lettuceOptions = [0, 1, 2, 3];
const ketchupOptions = [0, 1, 2];
const drinkOptions = ["Coke", "Pepsi", "Sprite", "Fanta", "Water", "None"];
const dessertOptions = ["Icecream", "Brownie", "Cookie", "None"];

// game values
let money = 1000;
let newOrdersList = [];
let pendingOrdersList = [];
let storageList = {
  buns: 0,
  patties: 0,
  cheeseSlices: 0,
  lettuceHeads: 0,
  ketchupRefills: 0,
  cokeContainers: 0,
  pepsiContainers: 0,
  spriteContainers: 0,
  fantaContainers: 0,
  icecreamContainers: 0,
  brownies: 0,
  cookies: 0
};
let grillSize = 8;
let grilledPatties = 0;

// anti-hardcode values
const timeSpeed = 100; // in miliseconden per uur
let hour = 8;
let minute = 0;
let clockRunning = false;
let arrivingOrders = 0;
let nextOrderNumber = 1;
const scrollSpeed = 3; 


// ---------- buttons ----------
openRestaurantButton.addEventListener("click", function () {
  hour = 8;
  minute = 0;
  startClock();
  orderLoop();
});

giveMoney.addEventListener("click", function () {
  money += 100;
  UpdateUI();
});

// computer
openComputerButton.addEventListener("click", function () {
  computerScreen.style.display = "block";
});

closeComputerScreen.addEventListener("click", function () {
  computerScreen.style.display = "none";
});

openShopButton.addEventListener("click", function () {
  openShopButton.style.display = "none";
  openStorageButton.style.display = "none";
  closeComputerScreen.style.display = "none";
  shopScreen.style.display = "block";
  initShop();
});

closeShopButton.addEventListener("click", function () {
  openShopButton.style.display = "block";
  openStorageButton.style.display = "block";
  closeComputerScreen.style.display = "block";
  shopScreen.style.display = "none";
});

openStorageButton.addEventListener("click", function () {
  openShopButton.style.display = "none";
  openStorageButton.style.display = "none";
  closeComputerScreen.style.display = "none";
  storageScreen.style.display = "block";
});

closeStorageButton.addEventListener("click", function () {
  openShopButton.style.display = "block";
  openStorageButton.style.display = "block";
  closeComputerScreen.style.display = "block";
  storageScreen.style.display = "none";
});


// UI updater
// UpdateUI moet ook grilledPatties tonen
function UpdateUI() {
  moneyDiv.innerHTML = `$${money}`;

  let output = "";
  for (const item in storageList) {
    output += `${item}: ${storageList[item]}<br>`;
  }
  storage.innerHTML = `${output}
                       Grilled Patties: ${grilledPatties}`;
}


// ---------- day loop ----------
// main loop
async function orderLoop() {
  // run as long as time is between 08:00 and 22:00
  while (hour < 22) {
    const delay = Math.floor(Math.random() * 2000) + 1000; // 1–3 sec

    arrivingOrders++;
    startNextOrderTimer(delay);

    await wait(delay);

    const newOrder = {
      id: nextOrderNumber,
      delay: delay,
      order: {
        burger: randomBurger(),
        drink: randomFrom(drinkOptions),
        dessert: randomFrom(dessertOptions)
      }
    };

    newOrdersList.push(newOrder);
    renderOrders();

    nextOrderNumber++;
    arrivingOrders--;

    // If no more pending orders and day is over, show '?'
    if (hour >= 22 && arrivingOrders === 0) {
      nextOrderTimer.innerHTML = "Next order in: ?";
    }
  }
}

// start the clock of the day loop
function startClock() {
  if (clockRunning) return;
  clockRunning = true;

  updateClockDisplay();

  let interval = setInterval(() => {
    minute++;

    if (minute >= 60) {
      minute = 0;
      hour++;
    }

    updateClockDisplay();

    if (hour >= 22) {
      clearInterval(interval);
      clockRunning = false;
    }
  }, timeSpeed / 60); // 1 minute interval
}

// update clock display
function updateClockDisplay() {
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");

  clock.innerHTML = `Time: ${hh}:${mm}`;
}

// random order generators
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomBurger() {
  return {
    bun: randomFrom(bunOptions),
    patty: randomFrom(pattyOptions),
    cheese: randomFrom(cheeseOptions),
    lettuce: randomFrom(lettuceOptions),
    ketchup: randomFrom(ketchupOptions)
  };
}

// delay for next order
function startNextOrderTimer(delay) {
  let remaining = delay;

  const interval = setInterval(() => {
    remaining -= 100;

    // stop normally when time expires
    if (remaining <= 0) {
      clearInterval(interval);

      if (hour >= 22 && arrivingOrders === 0) {
        nextOrderTimer.innerHTML = "Next order in: ?";
      }

      return;
    }

    // keep updating even when hour >= 22
    nextOrderTimer.innerHTML = `Next order in: ${(remaining / 1000).toFixed(1)}s`;

  }, 100);
}

// delay generator
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// dont display 0 values in order
function displayPart(label, value, unit = "") {
  if (value === 0 || value === "None") return "";
  return `${label}: ${value}${unit}`;
}

// render orders
function renderOrders() {
  newOrders.innerHTML = "";
  pendingOrders.innerHTML = "";

  newOrdersList.forEach((order) => {
    const b = order.order.burger;

    const div = document.createElement("div");
    div.classList.add("order");
    div.innerHTML = `
      <strong>Order ${order.id}</strong>
      <span>${displayPart("Bun", b.bun)}</span>
      <span>${displayPart("Patty(s)", b.patty)}</span>
      <span>${displayPart("Cheese", b.cheese)}</span>
      <span>${displayPart("Lettuce", b.lettuce)}</span>
      <span>${displayPart("Ketchup", b.ketchup)}</span>
      <span>${displayPart("Drink", order.order.drink)}</span>
      <span>${displayPart("Dessert", order.order.dessert)}</span>
      <button class="takeOrderBtn">Take Order</button>
    `;

    const takeOrderButton = div.querySelector(".takeOrderBtn");
    takeOrderButton.addEventListener("click", () => {
      pendingOrdersList.push(order);
      newOrdersList = newOrdersList.filter(o => o.id !== order.id);
      renderOrders();
    });

    newOrders.appendChild(div);
  });

  pendingOrdersList.forEach((order, index) => {
    const b = order.order.burger;

    const div = document.createElement("div");
    div.classList.add("order");
    div.innerHTML = `
      <strong>Order ${order.id}</strong>
      <span>${displayPart("Bun", b.bun)}</span>
      <span>${displayPart("Patty(s)", b.patty)}</span>
      <span>${displayPart("Cheese", b.cheese)}</span>
      <span>${displayPart("Lettuce", b.lettuce)}</span>
      <span>${displayPart("Ketchup", b.ketchup)}</span>
      <span>${displayPart("Drink", order.order.drink)}</span>
      <span>${displayPart("Dessert", order.order.dessert)}</span>
      <button class="deleteOrderBtn">Delete Order</button>
    `;

    const deleteButton = div.querySelector(".deleteOrderBtn");
    deleteButton.addEventListener("click", () => {
      pendingOrdersList = pendingOrdersList.filter(o => o.id !== order.id);
      renderOrders();
    });

    pendingOrders.appendChild(div);
  });
}



function InitializeWorkstations() {
  let html = "";
  for (let i = 0; i < grillSize; i++) {
    html += `<div class="grill-spot" data-index="${i}">
               <span class="grill-status">Empty</span>
               <div class="progress-bar" style="width: 0%;"></div>
             </div>`;
  }
  grillContainer.innerHTML = html;

  document.querySelectorAll(".grill-spot").forEach(spot => {
    spot.addEventListener("click", () => handleGrillClick(spot));
  });
}

async function handleGrillClick(spot) {
  let status = spot.dataset.status || "empty"; // empty, cooking1, flipped, cooking2, done
  let progressBar = spot.querySelector(".progress-bar");
  let grillStatusText = spot.querySelector(".grill-status");

  if (status === "empty") {
    if (storageList.patties > 0) {
      storageList.patties--;
      UpdateUI();
      spot.dataset.status = "cooking1";
      grillStatusText.textContent = "Cooking side 1...";
      await cookBurger(progressBar);
      spot.dataset.status = "flipped";
      grillStatusText.textContent = "Click to flip!";
    }
  } else if (status === "flipped") {
    spot.dataset.status = "cooking2";
    grillStatusText.textContent = "Cooking side 2...";
    await cookBurger(progressBar);
    spot.dataset.status = "done";
    grillStatusText.textContent = "Click to remove!";
  } else if (status === "done") {
    spot.dataset.status = "empty";
    progressBar.style.width = "0%";
    grillStatusText.textContent = "Empty";
    grilledPatties++;
    UpdateUI();
  }
}

function cookBurger(progressBar) {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5; // elke 2% per seconde
      progressBar.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 1000); // 1 sec per 2%
  });
}



// ---------- shop ----------
const shopItems = {
  buns: { priceKey: "buns", amountKey: "buns", storageKey: "buns", buttonId: "buyBuns" },
  patties: { priceKey: "patties", amountKey: "patties", storageKey: "patties", buttonId: "buyPatties" },
  lettuceHeads: { priceKey: "lettuceHeads", amountKey: "lettuceHeads", storageKey: "lettuceHeads", buttonId: "buyLettuceHeads" },
  cheeseSlices: { priceKey: "cheeseSlices", amountKey: "cheeseSlices", storageKey: "cheeseSlices", buttonId: "buyCheeseSlices" },
  ketchupRefills: { priceKey: "ketchupRefill", amountKey: "ketchupRefill", storageKey: "ketchupRefills", buttonId: "buyKetchupRefills" },
  cokeContainers: { priceKey: "drinkContainer", amountKey: "drinkContainer", storageKey: "cokeContainers", buttonId: "buyCokeDrinkContainer" },
  pepsiContainers: { priceKey: "drinkContainer", amountKey: "drinkContainer", storageKey: "pepsiContainers", buttonId: "buyPepsiDrinkContainer" },
  spriteContainers: { priceKey: "drinkContainer", amountKey: "drinkContainer", storageKey: "spriteContainers", buttonId: "buySpriteDrinkContainer" },
  fantaContainers: { priceKey: "drinkContainer", amountKey: "drinkContainer", storageKey: "fantaContainers", buttonId: "buyFantaDrinkContainer" },
  icecreamContainers: { priceKey: "icecreamContainer", amountKey: "icecreamContainer", storageKey: "icecreamContainers", buttonId: "buyIcecreamContainer" },
  brownies: { priceKey: "brownies", amountKey: "brownies", storageKey: "brownies", buttonId: "buyBrownies" },
  cookies: { priceKey: "cookies", amountKey: "cookies", storageKey: "cookies", buttonId: "buyCookies" }
};

function initShop() {
  Object.keys(shopItems).forEach(item => {
    const { priceKey, amountKey, storageKey, buttonId } = shopItems[item];

    document.getElementById(buttonId).addEventListener("click", () => {
      if (money >= price[priceKey]) {
        money -= price[priceKey];
        storageList[storageKey] += amount[amountKey]; // fixed
        UpdateUI();
      }
    });
  });
}


// scroll event
newOrders.addEventListener("wheel", (e) => {
    e.preventDefault();
    newOrders.scrollBy({
        left: e.deltaY * scrollSpeed,
        behavior: "smooth" // smooth scrolling effect
    });
});

pendingOrders.addEventListener("wheel", (e) => {
    e.preventDefault();
    pendingOrders.scrollBy({
        left: e.deltaY * scrollSpeed,
        behavior: "smooth" // smooth scrolling effect
    });
});

UpdateUI();
InitializeWorkstations();