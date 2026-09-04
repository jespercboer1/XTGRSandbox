import { gameState } from "../core/state.js";
import { emit } from "../core/eventBus.js";
import { actionData } from "../data/actionData.js";

export function performAction(action) {
  const data = actionData[action];

  if (!data) {
    console.error("Unknown action:", action);
    return;
  }

  // Money
  if (data.money) {
    gameState.money += data.money;
  }

  // Reputation
  if (data.reputation) {
    gameState.shop.reputation += data.reputation;
  }

  // Flags (merge, not replace)
  if (data.flags) {
    gameState.flags = {
      ...gameState.flags,
      ...data.flags
    };
  }

  if (data.inventory) {
    for (const item in data.inventory) {
      gameState.shopInventory[item] =
        (gameState.shopInventory[item] || 0) + data.inventory[item];
    }
  }

  emit("STATE_CHANGED");
}