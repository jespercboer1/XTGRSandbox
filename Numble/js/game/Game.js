import { DiceRoller } from "./DiceRoller.js";
import { ScoreCalculator } from "./ScoreCalculator.js";
import { CombinationsChecker } from "../combinations/CombinationsChecker.js";
import { CombinationsRegistry } from "../combinations/CombinationsRegistry.js";

export class Game {
    constructor() {
        this.diceRoller = new DiceRoller();
        this.scoreCalculator = new ScoreCalculator();
        this.combinationsChecker = new CombinationsChecker(
            CombinationsRegistry
        );
    }

    roll() {
        const numbers = this.diceRoller.roll();
        const combinations = this.combinationsChecker.check(numbers);
        const score = this.scoreCalculator.calculate(combinations);

        return {
            numbers,
            combinations,
            score
        };
    }
}