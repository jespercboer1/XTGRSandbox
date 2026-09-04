import { gameState } from "./state.js";
import { SCENES } from "../data/scenes.js";
import { emit } from "./eventBus.js";

export function goToScene(id) {
  gameState.currentScene = id;
  emit("STATE_CHANGED");
}

export function getCurrentScene() {
  return SCENES[gameState.currentScene];
}