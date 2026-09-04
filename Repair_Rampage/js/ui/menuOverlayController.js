import { helpContent } from "../data/helpContent.js";
import { getShopInventory, getPersonalInventory } from "./inventoryRenderer.js";
import { renderSaveContent, setupSaveButtons } from "../core/saveSystem.js";

export function setupOverlay() {
    setupMenuButtons();
}

// Set up event listeners for menu buttons and overlay interactions
function setupMenuButtons() {
  document.getElementById("shop_inventory").onclick = () => {
    const overlay = document.getElementById("menu_overlay");
    overlay.style.display = "flex";
    setTimeout(() => overlay.style.opacity = "1", 0);

    document.getElementById("menu_overlay_title").innerHTML = "Shop Inventory";
    document.getElementById("menu_overlay_content").innerHTML = getShopInventory();
  };

  document.getElementById("personal_inventory").onclick = () => {
    const overlay = document.getElementById("menu_overlay");
    overlay.style.display = "flex";
    setTimeout(() => overlay.style.opacity = "1", 0);

    document.getElementById("menu_overlay_title").innerHTML = "Personal Inventory";
    document.getElementById("menu_overlay_content").innerHTML = getPersonalInventory();
  };

  document.getElementById("help_menu").onclick = () => {
    const overlay = document.getElementById("menu_overlay");
    overlay.style.display = "flex";
    setTimeout(() => overlay.style.opacity = "1", 0);

    document.getElementById("menu_overlay_title").innerHTML = "Help!";
    document.getElementById("menu_overlay_content").innerHTML = helpContent;
  };

  document.getElementById("save_game").onclick = () => {
    const overlay = document.getElementById("menu_overlay");
    overlay.style.display = "flex";
    setTimeout(() => overlay.style.opacity = "1", 0);

    document.getElementById("menu_overlay_title").innerHTML = "Save Game";
    document.getElementById("menu_overlay_content").innerHTML = renderSaveContent();

    setupSaveButtons();
  };

  document.getElementById("settings_menu").onclick = () => {
    const overlay = document.getElementById("menu_overlay");
    overlay.style.display = "flex";
    setTimeout(() => overlay.style.opacity = "1", 0);

    document.getElementById("menu_overlay_title").innerHTML = "Settings";
    document.getElementById("menu_overlay_content").innerHTML = `
      <p>Settings are not implemented yet. Please check back in a future update!</p>
    `;
  };

  // Close overlay when clicking outside content or on close button
  document.getElementById("close_menu_overlay").onclick = () => {
    const overlay = document.getElementById("menu_overlay");
    overlay.style.opacity = "0";
    setTimeout(() => { overlay.style.display = "none"; }, 200);
  };

  document.getElementById("menu_overlay").onclick = () => {
    const overlay = document.getElementById("menu_overlay");
    overlay.style.opacity = "0";
    setTimeout(() => { overlay.style.display = "none"; }, 200);
  };

  document.getElementById("menu_overlay_screen").onclick = (e) => {
    e.stopPropagation(); // Prevent clicks inside the content area from closing the overlay
  };
}