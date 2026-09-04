// ────────────── ELEMENT SELECTORS ──────────────
const diceContainer = document.getElementById('diceContainer');
const rollButton = document.getElementById('rollButton');
const rollCooldownBar = document.getElementById('rollCooldown');
const lastRollSpan = document.getElementById('lastRoll');
const pointsSpan = document.getElementById('points');
const upgradeButton = document.getElementById('upgradeButton');
const upgradePanel = document.getElementById('upgradePanel');
const upgradeTitle = document.getElementById('upgradeTitle');
const upgradeContent = document.getElementById('upgradeContent');
const closeUpgrade = document.getElementById('closeUpgrade');
const menuButton = document.getElementById('menuButton');
const menuContent = document.getElementById('menuContent');
const saveButton = document.getElementById('saveButton');
const statsButton = document.getElementById('statsButton');
const achievmentsButton = document.getElementById('achievmentsButton');
const settingsButton = document.getElementById('settingsButton');
const overlayMenu = document.getElementById('overlayMenu');
const overlayMenuTitle = document.getElementById('overlayMenuTitle');
const overlayMenuContent = document.getElementById('overlayMenuContent');
const closeOverlayMenu = document.getElementById('closeOverlayMenu');
const globalMultiplierContainer = document.getElementById('globalMultiplier');
const ClickMeText = document.getElementById('ClickMeText');

// ────────────── GLOBAL VARIABLES ──────────────
let diceAmount = 1;
const maxDice = 10;
let points = 0;
let totalEarned = 0;
let upgradeCost = 50;
let canRoll = true;
let activeUpgradeIndex = null;
const rollDiceTimeout = 1000; // in ms
let achievements = [];
let unlockedAchievements = [];
let currentLang = 'en';
let translations = {};
let globalMultiplierMax = 2;
let ClickMeToggleSave = false;

// Dice attributes
let diceMultipliers = [1.0];
let diceMultiplierUpgradeCosts = [50];
let diceMinValues = [1];
let diceMinValuesUpgradeCosts = [60];
let diceMaxValues = [6];
let diceMaxValuesUpgradeCosts = [75];

// ────────────── SETUP ──────────────
function setupDice() {
  diceContainer.innerHTML = '';

  // Zorg dat arrays gelijklopen met diceAmount
  while (diceMultipliers.length < diceAmount) diceMultipliers.push(1.0);
  while (diceMultiplierUpgradeCosts.length < diceAmount) diceMultiplierUpgradeCosts.push(50);
  while (diceMinValues.length < diceAmount) diceMinValues.push(1);
  while (diceMinValuesUpgradeCosts.length < diceAmount) diceMinValuesUpgradeCosts.push(60);
  while (diceMaxValues.length < diceAmount) diceMaxValues.push(6);
  while (diceMaxValuesUpgradeCosts.length < diceAmount) diceMaxValuesUpgradeCosts.push(75);

  diceMultipliers.forEach((multiplier, i) => {
    if (i >= diceAmount) return;
    const dice = document.createElement('div');
    dice.className = 'dice';
    dice.dataset.index = i;
    dice.innerHTML = `
      <span class="dice-number">?</span>
      <div class="multiplier-badge">${multiplier.toFixed(1)}×</div>
      <div class="earned-badge">+0</div>
    `;
    dice.addEventListener('click', () => openUpgradeMenu(i));
    diceContainer.appendChild(dice);
  });

  if (activeUpgradeIndex !== null && activeUpgradeIndex !== 'global') updateUpgradeMenuButton();
}

// ────────────── ROLL SYSTEM ──────────────
function rollDice() {
  if (!canRoll) return;
  unlockAchievement('first-roll');

  canRoll = false;
  rollButton.disabled = true;

  // Start cooldown
  rollCooldownBar.style.transition = 'none';
  rollCooldownBar.style.width = '0%';
  void rollCooldownBar.offsetWidth; // force reflow
  rollCooldownBar.style.transition = `width ${rollDiceTimeout / 1000}s linear`;
  rollCooldownBar.style.width = '100%';

  let totalRoll = 0;
  document.querySelectorAll('.dice').forEach((die, i) => {
    const number = Math.floor(Math.random() * (diceMaxValues[i] - diceMinValues[i] + 1)) + diceMinValues[i];
    const earned = number * diceMultipliers[i];
    die.querySelector('.dice-number').textContent = number;
    die.querySelector('.earned-badge').textContent = `+${earned.toFixed(1)}`;
    totalRoll += earned;
  });

  const globalMultiplierRandomNum = Math.floor(Math.random() * globalMultiplierMax) + 1;
  globalMultiplierContainer.textContent = `X${globalMultiplierRandomNum}`;
  totalRoll *= globalMultiplierRandomNum;

  lastRollSpan.textContent = totalRoll.toFixed(1);
  points += totalRoll;
  totalEarned += totalRoll;
  checkPointAchievements();
  pointsSpan.textContent = points.toFixed(1);

  if (activeUpgradeIndex === 'global') {
    updateGlobalUpgradeMenu();
  } else if (activeUpgradeIndex !== null) {
    updateUpgradeMenuButton();
  }

  setTimeout(() => {
    rollButton.disabled = false;
    canRoll = true;
    rollCooldownBar.style.transition = 'none';
    rollCooldownBar.style.width = '0%';
  }, rollDiceTimeout);
}

// ────────────── GLOBAL UPGRADE PANEL ──────────────
upgradeButton.addEventListener('click', openGlobalUpgradeMenu);

function openGlobalUpgradeMenu() {
  activeUpgradeIndex = 'global';
  upgradePanel.style.display = 'flex';
  upgradeTitle.textContent = translations.upgrade_menu_title;
  updateGlobalUpgradeMenu();
}

function updateGlobalUpgradeMenu() {
  const globalMultCost = Math.floor(globalMultiplierMax * 100);
  upgradeTitle.textContent = translations.upgrade_menu_title;

  upgradeContent.innerHTML = `
    <div class="upgrade-item">
      <span>${translations.upgrade_extra_dice}: ${diceAmount}/${maxDice}</span>
      <button id="globalDiceUpgradeBtn" ${diceAmount >= maxDice || points < upgradeCost ? 'disabled' : ''}>
        ${translations.upgrade_add_dice} ${upgradeCost}p
      </button>
    </div>
    <div class="upgrade-item">
      <span>${translations.upgrade_global_mult}: X${globalMultiplierMax}</span>
      <button id="globalMultUpgradeBtn" ${points < globalMultCost ? 'disabled' : ''}>
        ${translations.upgrade_add_mult} ${globalMultCost}p
      </button>
    </div>
  `;

  const diceBtn = document.getElementById('globalDiceUpgradeBtn');
  if (diceBtn) {
    diceBtn.addEventListener('click', () => {
      if (diceAmount >= maxDice || points < upgradeCost) return;
      points -= upgradeCost;
      diceAmount++;
      if (diceAmount >= 2) unlockAchievement('second-dice');
      upgradeCost = Math.floor(upgradeCost * 1.5);
      setupDice();
      pointsSpan.textContent = points.toFixed(1);
      updateGlobalUpgradeMenu();
    });
  }

  const multBtn = document.getElementById('globalMultUpgradeBtn');
  if (multBtn) {
    multBtn.addEventListener('click', () => {
      if (points < globalMultCost) return;
      points -= globalMultCost;
      globalMultiplierMax++;
      unlockAchievement('global-multiplier-upgrade');
      pointsSpan.textContent = points.toFixed(1);
      updateGlobalUpgradeMenu();
    });
  }
}

// ────────────── INDIVIDUAL DICE UPGRADE MENU ──────────────
function openUpgradeMenu(index) {
  if (!ClickMeToggleSave) {
    ClickMeToggle();
    ClickMeToggleSave = true;
  }
  activeUpgradeIndex = index;
  upgradePanel.style.display = 'flex';
  upgradeTitle.textContent = `${translations.dice_upgrade_menu_title} ${index + 1}`;
  updateUpgradeMenuButton();
}

function updateUpgradeMenuButton() {
  if (activeUpgradeIndex === null) return;
  const i = activeUpgradeIndex;
  const cost = diceMultiplierUpgradeCosts[i];
  const minCost = diceMinValuesUpgradeCosts[i];
  const maxCost = diceMaxValuesUpgradeCosts[i];

  upgradeContent.innerHTML = `
    <div class="upgrade-item">
      <span>${translations.upgrade_multiplier}: ${diceMultipliers[i].toFixed(1)}×</span>
      <button id="upgradeDiceBtn" ${points < cost ? 'disabled' : ''}>
        ${translations.upgrade_multiplier_button} ${cost}p
      </button>
    </div>
    <div class="upgrade-item">
      <span>${translations.upgrade_min_value}: ${diceMinValues[i]}</span>
      <button id="minValueBtn" ${points < minCost || diceMinValues[i] >= diceMaxValues[i] ? 'disabled' : ''}>
        ${translations.upgrade_min_button} ${minCost}p
      </button>
    </div>
    <div class="upgrade-item">
      <span>${translations.upgrade_max_value}: ${diceMaxValues[i]}</span>
      <button id="maxValueBtn" ${points < maxCost ? 'disabled' : ''}>
        ${translations.upgrade_max_button} ${maxCost}p
      </button>
    </div>
  `;

  const addUpgradeLogic = (btnId, condition, action) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!condition()) return;
      action();
      pointsSpan.textContent = points.toFixed(1);
      unlockAchievement('first-dice-upgrade');
      openUpgradeMenu(i);
    });
  };

  addUpgradeLogic('upgradeDiceBtn',
    () => points >= cost,
    () => {
      points -= cost;
      diceMultipliers[i] = parseFloat((diceMultipliers[i] + 0.1).toFixed(1));
      diceMultiplierUpgradeCosts[i] = Math.floor(cost * 1.5);
      document.querySelector(`.dice[data-index="${i}"] .multiplier-badge`).textContent = `${diceMultipliers[i].toFixed(1)}×`;
    }
  );

  addUpgradeLogic('minValueBtn',
    () => points >= minCost && diceMinValues[i] < diceMaxValues[i],
    () => {
      points -= minCost;
      diceMinValues[i]++;
      diceMinValuesUpgradeCosts[i] = Math.floor(minCost * 1.5);
    }
  );

  addUpgradeLogic('maxValueBtn',
    () => points >= maxCost,
    () => {
      points -= maxCost;
      diceMaxValues[i]++;
      diceMaxValuesUpgradeCosts[i] = Math.floor(maxCost * 1.5);
    }
  );
}
// ────────────── SAVE / LOAD / RESET ──────────────
function saveGame() {
  localStorage.setItem('diceGameSave', JSON.stringify({
    diceAmount, points, totalEarned, upgradeCost,
    diceMultipliers, diceMultiplierUpgradeCosts,
    diceMinValuesUpgradeCosts, diceMaxValuesUpgradeCosts,
    diceMinValues, diceMaxValues, unlockedAchievements,
    globalMultiplierMax, ClickMeToggleSave
  }));
  saveButton.textContent = '💾 Saved!';
  setTimeout(() => saveButton.textContent = '💾 Save Game', 1000);
}

function loadGame() {
  const saved = JSON.parse(localStorage.getItem('diceGameSave')) || {};

  diceAmount = saved.diceAmount ?? 1;
  points = saved.points ?? 0;
  totalEarned = saved.totalEarned ?? 0;
  upgradeCost = saved.upgradeCost ?? 50;
  diceMultipliers = saved.diceMultipliers ?? [1.0];
  diceMultiplierUpgradeCosts = saved.diceMultiplierUpgradeCosts ?? [50];
  diceMinValues = saved.diceMinValues ?? [1];
  diceMinValuesUpgradeCosts = saved.diceMinValuesUpgradeCosts ?? [60];
  diceMaxValues = saved.diceMaxValues ?? [6];
  diceMaxValuesUpgradeCosts = saved.diceMaxValuesUpgradeCosts ?? [75];
  unlockedAchievements = saved.unlockedAchievements ?? [];
  globalMultiplierMax = saved.globalMultiplierMax ?? 2;
  ClickMeToggleSave = saved.ClickMeToggleSave ?? false;

  if (ClickMeToggleSave) {
    ClickMeText.style.display = 'none';
  }

  canRoll = true;
}

function resetGame() {
  // Reset all game data
  diceAmount = 1;
  points = 0;
  totalEarned = 0;
  upgradeCost = 50;
  diceMultipliers = [1.0];
  diceMultiplierUpgradeCosts = [50];
  diceMinValues = [1];
  diceMaxValues = [6];
  diceMinValuesUpgradeCosts = [60];
  diceMaxValuesUpgradeCosts = [75];
  globalMultiplierMax = 2;
  ClickMeToggleSave = false;
  unlockedAchievements = [];

  // Clear local storage
  localStorage.removeItem('diceGameSave');
  localStorage.removeItem('unlockedAchievements');

  // Reinitialize game visuals
  setupDice();
  pointsSpan.textContent = 0;
  lastRollSpan.textContent = 0;
  upgradePanel.style.display = 'none';
  activeUpgradeIndex = null;

  // ✅ Don’t immediately hide the menus — let the user reopen them manually
  menuContent.style.display = 'none';
  overlayMenu.style.display = 'none';
  menuButton.classList.remove("change");
}

// ────────────── MENU ──────────────
menuButton.addEventListener('click', () => {
  menuButton.classList.toggle("change");
  menuContent.style.display = menuContent.style.display === 'flex' ? 'none' : 'flex';
});

function updateStatsMenu() {
  overlayMenu.style.display = 'flex';
  overlayMenuTitle.textContent = translations.overlay_stats_title;
  overlayMenuContent.innerHTML = `
    <div class="stats overlay-menu-item">
      <span>${translations.overlay_stats_dice}: ${diceAmount}</span>
      <span>${translations.overlay_stats_total}: ${totalEarned.toFixed(1)}</span>
    </div>
  `;
}

function openSettingsMenu() {
  overlayMenu.style.display = 'flex';
  overlayMenuTitle.textContent = translations.overlay_settings_title;
  overlayMenuContent.innerHTML = `
    <div class="settings overlay-menu-item">
      <select id="languageSelect" title="${translations.language_select}">
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
      </select>
      <button id="resetButton">${translations.reset_button}</button>
    </div>
  `;

  // Set language selector value
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  const langSelect = document.getElementById('languageSelect');
  langSelect.value = savedLang;

  // Reattach event listeners every time
  langSelect.addEventListener('change', (e) => loadLanguage(e.target.value));

  const resetBtn = document.getElementById('resetButton');
  resetBtn.addEventListener('click', () => {
    let confirmed = true;
    try {
        confirmed = confirm(translations.reset_confirm);
    } catch {}
    resetGame();
  });
}

statsButton.addEventListener('click', updateStatsMenu);
settingsButton.addEventListener('click', openSettingsMenu);

achievmentsButton.addEventListener('click', () => {
  overlayMenu.style.display = 'flex';
  overlayMenuTitle.textContent = translations.overlay_achievements_title;
  updateAchievementsMenu();
});

// ────────────── ACHIEVEMENTS ──────────────
async function loadAchievements() {
  const savedUnlocked = JSON.parse(localStorage.getItem('unlockedAchievements'));
  if (savedUnlocked) unlockedAchievements = savedUnlocked;

  // Try to load achievements in the current language, fallback to English
  try {
    const response = await fetch(`lang/${currentLang}/${currentLang}_achievements.json`);
    if (!response.ok) throw new Error('Missing localized achievements');
    achievements = await response.json();
  } catch (err) {
    console.warn(`⚠️ Could not load achievements for ${currentLang}, falling back to English...`);
    const fallbackResponse = await fetch(`lang/en/en_achievements.json`);
    achievements = await fallbackResponse.json();
  }
}

function unlockAchievement(id) {
  if (unlockedAchievements.includes(id)) return;

  const achievement = achievements.find(a => a.id === id);
  if (!achievement) return;

  unlockedAchievements.push(id);

  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `<strong>🏆 ${achievement.title}</strong><br>${achievement.description}`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);

  updateAchievementsMenu();
}

function updateAchievementsMenu() {
  if (!achievements.length) return;

  overlayMenuTitle.textContent = translations.overlay_achievements_title;
  overlayMenuContent.innerHTML = achievements.map(a => `
    <div class="achievements overlay-menu-item ${unlockedAchievements.includes(a.id) ? 'unlocked' : 'locked'}">
      <h3>${a.title}</h3>
      <span>${a.description}</span>
      <span>${unlockedAchievements.includes(a.id) ? '✅ Unlocked' : '🔒 Locked'}</span>
    </div>
  `).join('');
}

function checkPointAchievements() {
  if (points >= 100) unlockAchievement('hundred-points');
  if (points >= 1000) unlockAchievement('thousand-points');
}

// ────────────── CLOSE BUTTONS ──────────────
closeUpgrade.addEventListener('click', () => {
  upgradePanel.style.display = 'none';
  activeUpgradeIndex = null;
});

closeOverlayMenu.addEventListener('click', () => {
  overlayMenu.style.display = 'none';
});

// ────────────── LANGUAGE SYSTEM ──────────────
async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}/${lang}_translations.json`);
    translations = await response.json();
  } catch (e) {
    console.warn(`⚠️ Could not load ${lang} language file, using English fallback.`);
    const response = await fetch(`lang/en/en_translations.json`);
    translations = await response.json();
  }

  currentLang = lang;
  localStorage.setItem('selectedLanguage', lang);

  applyTranslations();
  await loadAchievements();
}

function applyTranslations() {
  // Static text
  document.getElementById('gameTitle').textContent = translations.game_title;
  document.getElementById('rollButton').textContent = translations.roll_button;
  document.getElementById('saveButton').textContent = translations.save_button;
  document.getElementById('statsButton').textContent = translations.stats_button;
  document.getElementById('achievmentsButton').textContent = translations.achievements_button;
  document.getElementById('settingsButton').textContent = translations.settings_button;
  document.getElementById('upgradeButton').textContent = translations.global_upgrades;

  // Points text
  const pointsText = document.querySelector('.points-text');
  if (pointsText) pointsText.childNodes[0].textContent = `${translations.total_points}: `;

  const scoreDiv = document.querySelector('.score');
  if (scoreDiv) scoreDiv.childNodes[0].textContent = `${translations.last_roll}: `;

  // ✅ Check if resetButton exists before touching it
  const overlayTitle = document.getElementById('overlayMenuTitle');
  const resetButton = document.getElementById('resetButton');
  if (overlayTitle) overlayTitle.textContent = translations.overlay_settings_title;
  if (resetButton) resetButton.textContent = translations.reset_button;

  // Update upgrade panels if open
  if (activeUpgradeIndex === 'global') {
    upgradeTitle.textContent = translations.upgrade_menu_title;
    updateGlobalUpgradeMenu();
  } else if (activeUpgradeIndex !== null) {
    upgradeTitle.textContent = `${translations.dice_upgrade_menu_title} ${activeUpgradeIndex + 1}`;
    updateUpgradeMenuButton();
  }
}

// ────────────── Help (Clickme button) ──────────────
function ClickMeToggle() {
  ClickMeText.style.display = 'none';
}

// ────────────── INIT ──────────────
rollButton.addEventListener('click', rollDice);
saveButton.addEventListener('click', saveGame);

async function init() {
  await loadAchievements();
  loadGame();
  setupDice();
  pointsSpan.textContent = points.toFixed(1);
  lastRollSpan.textContent = 0;
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  await loadLanguage(savedLang);
}

// ────────────── START GAME ──────────────
init();
