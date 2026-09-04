// Set inventory from localStorage
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let activatedCars = JSON.parse(localStorage.getItem("activatedCars")) || [];

// Set money from localStorage
let money = parseFloat(localStorage.getItem("money")) || 0;
document.getElementById("money").innerText = `$${money}`;

// Initialize sell confirmation setting
let sellConfirmationEnabled = localStorage.getItem("sellConfirmationEnabled");
if (sellConfirmationEnabled === null) {
  sellConfirmationEnabled = true;  // default ON
  localStorage.setItem("sellConfirmationEnabled", "true");
} else {
  sellConfirmationEnabled = (sellConfirmationEnabled === "true");
}

// Set checkbox state on page load
document.getElementById("confirmSellToggle").checked = sellConfirmationEnabled;

// Update setting when toggle is clicked
document.getElementById("confirmSellToggle").addEventListener("change", (e) => {
  sellConfirmationEnabled = e.target.checked;
  localStorage.setItem("sellConfirmationEnabled", sellConfirmationEnabled.toString());
});

// Setup all value's
let baseCarValue = 0;
let rarityPercent = 0;
let numberMultiplier = 1;
let multiplierBoost = 0;
let rarityBoost = 0;
let totalValue = 0;
let sellCarValue = 0;

let carGenerated = false;
let rarityGenerated = false;
let multiplierGenerated = false;
let hasCombined = false;

let incomeInterval;

// reset all hidden boxes
document.getElementById("carBtn2").style.display = "none";
document.getElementById("rarityBtn2").style.display = "none";
document.getElementById("multiplierBtn2").style.display = "none";

document.getElementById("carBackground").style.display = "none";
document.getElementById("rarityBackground").style.display = "none";
document.getElementById("multiplierBackground").style.display = "none";

document.getElementById("inventoryView").style.display = "none";

document.getElementById("settingsScreen").style.display = "none";

// Initialize all cars
const CarModels = [
  { name: "Peugeot 208", weight: 1/10 },
  { name: "Ford Focus", weight: 1/20 },
  { name: "Audi a6", weight: 1/40 },
  { name: "Mercedes S-class", weight: 1/80 },
  { name: "Porsche 911 Turbo S", weight: 1/160 }
];

// Initialize all rarities
const rarityChances = [
  { name: "Legendary", percent: 400, weight: 1 },
  { name: "Epic", percent: 200, weight: 4 },
  { name: "Rare", percent: 100, weight: 15 },
  { name: "Uncommon", percent: 50, weight: 30 },
  { name: "Common", percent: 0, weight: 50 }
];

function generateCar() {
  let totalWeight = CarModels.reduce((sum, c) => sum + c.weight, 0);
  let rand = Math.random() * totalWeight;
  let sum = 0;
  for (let car of CarModels) {
    sum += car.weight;
    if (rand < sum) {
      baseCarValue = 1 / car.weight;
      const model = car.name;
      const formattedName = model.replaceAll(" ", "_");
      const imagePath = `images/cars/${formattedName}.png`;
      document.getElementById("carImage").src = imagePath;
      document.getElementById("carInfo").innerText = `${model} ($${baseCarValue})`;
      document.getElementById("carBackground").style.display = "flex";
      document.getElementById("carBtn").style.display = "none";
      document.getElementById("carBtn2").style.display = "inline-block";
      carGenerated = true;
      checkIfCanCombine();
      return;
    }
  }
}


function generateRarity() {
  let totalWeight = rarityChances.reduce((sum, r) => sum + r.weight + rarityBoost, 0);
  let rand = Math.random() * totalWeight;
  let sum = 0;
  for (let rarity of rarityChances) {
    sum += rarity.weight + rarityBoost;
    if (rand < sum) {
      rarityPercent = rarity.percent;
      document.getElementById("rarityInfo").innerText = `${rarity.name} (+${rarityPercent}%)`;
      document.getElementById("rarityInfo").className = `rarity-${rarity.name.toLowerCase()}`;
      document.getElementById("rarityBackground").style.display = "flex";
      document.getElementById("rarityBackground").classList.add(`rarity-${rarity.name.toLowerCase()}-b`);
      document.getElementById("rarityBtn").style.display = "none";
      document.getElementById("rarityBtn2").style.display = "inline-block";
      rarityGenerated = true;
      checkIfCanCombine();
      return;
    }
  }
}

function generateMultiplier() {
  numberMultiplier = Math.floor(Math.random() * (6 + multiplierBoost));
  numberMultiplier = 1 + (numberMultiplier / 10);
  document.getElementById("multiplierInfo").innerText = `x${numberMultiplier}`;
  document.getElementById("multiplierBackground").style.display = "flex";
  document.getElementById("multiplierBtn").style.display = "none";
  document.getElementById("multiplierBtn2").style.display = "inline-block";
  multiplierGenerated = true;
  checkIfCanCombine();
}

function checkIfCanCombine() {
  if (carGenerated && rarityGenerated && multiplierGenerated) {
    document.getElementById("combineBtn").disabled = false;
  }
}

function combine() {
  totalValue = Number(((baseCarValue + (baseCarValue * (rarityPercent / 100))) * numberMultiplier).toFixed(2));
  sellCarValue = Number((baseCarValue / 10).toFixed(2));
  document.getElementById("totalValueInfo").innerText = `Total Car Value: $${totalValue}`;
  document.getElementById("sellValueInfo").innerText = `Sell Car Value: $${sellCarValue}`;

  hasCombined = true;
  document.getElementById("keepBtn").disabled = false;
  document.getElementById("sellBtn").disabled = false;
}

function sellCar() {
  if (!hasCombined) return;
  if (baseCarValue > 0) {
    if (sellConfirmationEnabled) {
      const confirmSell = confirm("Are you sure you want to sell this car?");
      if (!confirmSell) return;
    }

    money += sellCarValue;
    money = Number(money.toFixed(2));
    document.getElementById("money").innerText = `$${money}`;
    localStorage.setItem("money", money);
    resetGenerators();
  }
}

function keepCar() {
  if (!hasCombined) return;
  if (totalValue > 0) {
    // Extract car name and base value
    const carText = document.getElementById("carInfo").innerText; // e.g. "Porsche ($160)"
    const carName = carText.split(" ($")[0];
    const baseValue = parseFloat(carText.split(" ($")[1].replace(")", ""));

    // Extract rarity name and percent
    const rarityText = document.getElementById("rarityInfo").innerText; // e.g. "Legendary (+50%)"
    const rarityName = rarityText.split(" (+")[0];
    const rarityPercent = parseFloat(rarityText.split(" (+")[1].replace("%)", ""));

    // Extract multiplier
    const multiplierText = document.getElementById("multiplierInfo").innerText; // e.g. "x1.3"
    const multiplier = parseFloat(multiplierText.replace("x", ""));

    const carData = {
      carName,
      baseValue,
      rarityName,
      rarityPercent,
      multiplier,
      value: totalValue,
      activated: false
    };

    inventory.push(carData);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("activatedCars", JSON.stringify(activatedCars));
    updateInventoryUI();
    resetGenerators();
  }
}

function resetGenerators() {
  baseCarValue = 0;
  rarityPercent = 0;
  numberMultiplier = 1;

  hasCombined = false;
  carGenerated = false;
  rarityGenerated = false;
  multiplierGenerated = false;

  document.getElementById("combineBtn").disabled = true;
  document.getElementById("keepBtn").disabled = true;
  document.getElementById("sellBtn").disabled = true;

  document.getElementById("carInfo").innerText = "";
  document.getElementById("carBackground").style.display = "none";

  document.getElementById("rarityInfo").innerText = "";
  document.getElementById("rarityBackground").className = `section-rarity`;
  document.getElementById("rarityBackground").style.display = "none";

  document.getElementById("multiplierInfo").innerText = "";
  document.getElementById("multiplierBackground").style.display = "none";

  document.getElementById("totalValueInfo").innerText = "Total Car Value: $0";
  document.getElementById("sellValueInfo").innerText = "Sell Car Value: $0";

  document.getElementById("carBtn").style.display = "inline-block";
  document.getElementById("carBtn2").style.display = "none";
  document.getElementById("rarityBtn").style.display = "inline-block";
  document.getElementById("rarityBtn2").style.display = "none";
  document.getElementById("multiplierBtn").style.display = "inline-block";
  document.getElementById("multiplierBtn2").style.display = "none";
}

function upgradeMultiplier() {
  if (money >= 10) {
    money -= 10;
    multiplierBoost++;
    document.getElementById("money").innerText = money;
    alert("Multiplier chance upgraded!");
  } else {
    alert("Not enough money!");
  }
}

function upgradeRarity() {
  if (money >= 10) {
    money -= 10;
    rarityBoost++;
    document.getElementById("money").innerText = money;
    alert("Rarity chance upgraded!");
  } else {
    alert("Not enough money!");
  }
}

function clickHomeScreen() {
  document.getElementById("homeScreen").classList.add("active-outline");
  document.getElementById("inventoryScreen").classList.remove("active-outline");

  document.querySelector(".middle-row").style.display = "flex";
  document.getElementById("inventoryView").style.display = "none";
}

function clickInventoryScreen() {
  document.getElementById("homeScreen").classList.remove("active-outline");
  document.getElementById("inventoryScreen").classList.add("active-outline");

  document.querySelector(".middle-row").style.display = "none";
  document.getElementById("inventoryView").style.display = "block";
  updateInventoryUI();
  updateActivatedUI();
}

function updateInventoryUI() {
  const sortSelect = document.getElementById("sortSelect");
  const sortValue = sortSelect ? sortSelect.value : "value-desc";

  inventory.sort((a, b) => {
    switch (sortValue) {
      case "value-asc": return a.value - b.value;
      case "value-desc": return b.value - a.value;
      case "name-asc": return a.carName.localeCompare(b.carName);
      case "name-desc": return b.carName.localeCompare(a.carName);
      case "rarity-asc": return rarityChances.findIndex(r => r.name === b.rarityName) - rarityChances.findIndex(r => r.name === a.rarityName);
      case "rarity-desc": return rarityChances.findIndex(r => r.name === a.rarityName) - rarityChances.findIndex(r => r.name === b.rarityName);
      case "basevalue-asc": return a.baseValue - b.baseValue;
      case "basevalue-desc": return b.baseValue - a.baseValue;
      default: return b.value - a.value;
    }
  });

  const list = document.getElementById("inventoryList");
  list.innerHTML = "";

  inventory.forEach((car, index) => {
  const formattedName = car.carName.replaceAll(" ", "_");

  // Outer wrapper for border color
  const borderWrapper = document.createElement("div");
  borderWrapper.className = `car-border rarity-${car.rarityName.toLowerCase()}-b`;

  // Inner card container
  const card = document.createElement("div");
  card.className = "car-card";

  // Wrapper div for the image
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "car-image-wrapper";

  // Car image inside wrapper
  const carImg = document.createElement("img");
  carImg.src = `images/cars/${formattedName}.png`;
  carImg.alt = car.carName;
  carImg.className = "car-image";

  imageWrapper.appendChild(carImg);

  // Multiplier circle
  const multiplierCircle = document.createElement("div");
  multiplierCircle.className = "multiplier-circle";
  multiplierCircle.textContent = `x${car.multiplier}`;

  // Info text
  const infoText = document.createElement("div");
  infoText.className = "car-info";
  infoText.innerHTML = `
    <strong>${car.carName}</strong><br>
    Value: $${car.value}
  `;

  // Buttons wrapper
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "car-button-wrapper";

  // Sell button
  const sellBtn = document.createElement("button");
  sellBtn.textContent = "Sell";
  sellBtn.className = "button red sell-btn";
  sellBtn.onclick = () => sellFromInventory(index);

  // Activate button (new logic here)
  const activateBtn = document.createElement("button");
  activateBtn.textContent = car.activated ? "Activated" : "Activate";
  activateBtn.className = car.activated ? "button orange" : "button";
  activateBtn.disabled = car.activated;
  activateBtn.onclick = () => activateCar(index);

  // Append buttons
  buttonWrapper.appendChild(sellBtn);
  buttonWrapper.appendChild(activateBtn);

  // Assemble card
  card.appendChild(imageWrapper);
  card.appendChild(multiplierCircle);
  card.appendChild(infoText);
  card.appendChild(buttonWrapper);

  // Wrap in border div
  borderWrapper.appendChild(card);
  list.appendChild(borderWrapper);
});
}



function sellFromInventory(index) {
  const car = inventory[index];
  const sellPrice = Number((car.baseValue / 10).toFixed(2));

  if (sellConfirmationEnabled) {
    const confirmSell = confirm(`Are you sure you want to sell this car for $${sellPrice}?`);
    if (!confirmSell) return;
  }

  money += sellPrice;
  money = Number(money.toFixed(2));
  document.getElementById("money").innerText = `$${money}`;
  localStorage.setItem("money", money);

  inventory.splice(index, 1);
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("activatedCars", JSON.stringify(activatedCars));
  updateInventoryUI();
  updateActivatedUI();
  updateIncome();
}


function openSettings() {
  document.getElementById("settingsScreen").style.display = "flex";
}

function closeSettings() {
  document.getElementById("settingsScreen").style.display = "none";
}

window.addEventListener("click", function(e) {
  const settingsScreen = document.getElementById("settingsScreen");
  const content = document.querySelector(".settings-content");
  if (e.target === settingsScreen) {
    closeSettings();
  }
});

function clearInventory() {
  if (confirm("Are you sure you want to clear your entire inventory?")) {
    inventory = [];
    activatedCars = [];
    localStorage.removeItem("inventory");
    localStorage.removeItem("activatedCars");
    localStorage.removeItem("money");
    money = 0;
    updateMoneyDisplay();
    updateInventoryUI();
    updateActivatedUI();
  }
}

function saveGame() {
  localStorage.setItem("money", money);
  alert("Game saved!");
}

function updateActivatedUI() {
  const activatedList = document.getElementById("activatedList");
  activatedList.innerHTML = "";

  activatedCars.forEach((car, index) => {
    const li = document.createElement("li");
    li.innerText = `${car.carName} ($${car.value})`;

    const sellBtn = document.createElement("button");
    sellBtn.innerText = "Sell";
    sellBtn.className = "button red";
    sellBtn.onclick = () => {
      if (sellConfirmationEnabled && !confirm("Sell activated car?")) return;
      money += car.value / 10;
      updateMoneyDisplay();
      activatedCars.splice(index, 1);
      car.activated = false;
      inventory.push(car);
      updateActivatedUI();
      updateInventoryUI();
    };

    const deactivateBtn = document.createElement("button");
    deactivateBtn.innerText = "Deactivate";
    deactivateBtn.className = "button";
    deactivateBtn.onclick = () => {
      car.activated = false;
      activatedCars.splice(index, 1);
      inventory.push(car);
      updateActivatedUI();
      updateInventoryUI();
    };

    li.appendChild(sellBtn);
    li.appendChild(deactivateBtn);
    activatedList.appendChild(li);
  });

  updateIncome();
}

function activateCar(index) {
  const car = inventory[index];
  car.activated = true;
  activatedCars.push(car);
  inventory.splice(index, 1);
  localStorage.setItem("activatedCars", JSON.stringify(activatedCars));
  localStorage.setItem("inventory", JSON.stringify(inventory));
  updateActivatedUI();
  updateInventoryUI();
  updateIncome();
}

function updateIncome() {
  const totalPerSec = activatedCars.reduce((sum, car) => sum + car.value / 60, 0); // e.g. $/minute -> $/sec
  document.getElementById("moneyPerSecond").innerText = `(+${totalPerSec.toFixed(2)}/sec)`;

  if (incomeInterval) clearInterval(incomeInterval);
  incomeInterval = setInterval(() => {
    money += totalPerSec;
    money = Number(money.toFixed(2));
    updateMoneyDisplay();
  }, 1000);
}

function updateMoneyDisplay() {
  document.getElementById("money").innerText = `$${money}`;
  localStorage.setItem("money", money);
}

updateActivatedUI();
updateInventoryUI();
updateIncome();