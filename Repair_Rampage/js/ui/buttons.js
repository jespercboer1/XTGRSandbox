import { SCENES } from "../data/scenes.js";
import { gameState } from "../core/state.js";
import { goToScene } from "../core/sceneManager.js";
import {performAction} from "../systems/actions.js";

export function handleOption(index) {
  const scene = SCENES[gameState.currentScene];
  const option = scene.options[index];

  if (option.action) {
    console.log("Performing action:", option.action);
    performAction(option.action);
    console.log("Performed action:", option.action);
  }

  if (option.goto) {
    goToScene(option.goto);
  }
}