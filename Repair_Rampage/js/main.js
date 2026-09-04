import { on } from "./core/eventBus.js";
import { render } from "./ui/renderer.js";
import { setupOverlay } from "./ui/menuOverlayController.js";

setupOverlay();
render();
on("STATE_CHANGED", render);