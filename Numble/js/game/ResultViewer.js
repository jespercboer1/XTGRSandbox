import { CombinationsDisplay } from "../ui/CombinationsDisplay.js";
import { ScoreDisplay } from "../ui/ScoreDisplay.js";

export class Result_Viewer {
    constructor() {
        this.combinationsDisplay = new CombinationsDisplay();
        this.scoreDisplay = new ScoreDisplay();
    }

    showResult(combinations) {
        let score = 0;
        for (const combination of combinations) {
            this.combinationsDisplay.show(combination);
            score += combination.points;
            this.scoreDisplay.show(score);
        }
        this.scoreDisplay.show(score);
    }
}