import { getCurrentScene } from "../core/sceneManager.js";
import { gameState } from "../core/state.js";
import { handleOption } from "./buttons.js";

export function render() {
  // Main scene
  const scene = getCurrentScene();

  const optionsHTML = scene.options
    .map((opt, i) => {
      if (!opt.condition || opt.condition(gameState)) {
        if (opt.action) {
          return `<button class="game_option_action" data-index="${i}">${opt.text}</button>`;
        }
        else if (opt.goto) {
          return `<button class="game_option_goto" data-index="${i}">${opt.text}</button>`;
        }
      }
      return '';
    })
    .filter(html => html !== '')
    .join("");

  // Attach event listener to game container for delegation (only once)
  if (!document.getElementById("game").hasAttribute("data-listener-attached")) {
    document.getElementById("game").addEventListener("click", (e) => {
      if (e.target.matches('.game_option_action, .game_option_goto')) {
        const index = parseInt(e.target.dataset.index);
        console.log("Option clicked:", index);
        handleOption(index);
      }
    });
    document.getElementById("game").setAttribute("data-listener-attached", "true");
  }

  // Main content display
  document.getElementById("game").innerHTML = `
    <h2>${scene.title}</h2>
    <p>${scene.text}</p>
    <div class="game_options">${optionsHTML}</div>
  `;

  // Statistics
  document.getElementById("stats").innerHTML = `
    <p><span class="stat_label">Day ${gameState.day}</span></p>
    <p><span class="stat_label">${gameState.time.hour.toString().padStart(2, "0")}:${gameState.time.minute.toString().padStart(2, "0")}</span></p>
    <p><span class="stat_label orange">${scene.location}</span></p>
    <div class="devider"></div>
    <p><span class="stat_label green">Money:</span> $${gameState.money.toFixed(2)}</p>
    <p><span class="stat_label blue">Stamina:</span> ${gameState.stamina}</p>
    <p><span class="stat_label blue">Reputation:</span> ${gameState.shop.reputation}</p>
    <p><span class="stat_label red">Debt:</span> $${gameState.debt.toFixed(2)}</p>
  `;

  // Ensure menu overlay is hidden on render
  document.getElementById("menu_overlay").style.display = "none";
}