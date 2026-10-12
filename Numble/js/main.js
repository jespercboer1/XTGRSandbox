import { Game } from "./game/Game.js";
import { NumberDisplay } from "./ui/NumberDisplay.js";
import { ScoreDisplay } from "./ui/ScoreDisplay.js";
import { CombinationsDisplay } from "./ui/CombinationsDisplay.js";
import { CombinationsRegistry } from "./combinations/CombinationsRegistry.js";
import { AllCombinationsListDisplay } from "./ui/AllCombinationsListDisplay.js";
import { ClearDisplay } from "./ui/ClearDisplay.js";

const game = new Game();

const clearDisplay = new ClearDisplay();

const numberDisplay = new NumberDisplay();
const scoreDisplay = new ScoreDisplay();
const combinationsDisplay = new CombinationsDisplay();
const allCombinationsListDisplay = new AllCombinationsListDisplay(CombinationsRegistry);

document.getElementById("rollNumbers").onclick = async () => {
    document.getElementById("rollNumbers").disabled = true;
    clearDisplay.clear();
    const result = game.roll();
    
    await numberDisplay.show(result.numbers);
    scoreDisplay.show(result.score);
    combinationsDisplay.show(result.combinations);
    document.getElementById("rollNumbers").disabled = false;
};

let showAllCombinations = false;

document.getElementById("viewAllCombinations").onclick = () => {
    showAllCombinations = !showAllCombinations;

    if (showAllCombinations) {
        allCombinationsListDisplay.show();
    } else {
        allCombinationsListDisplay.hide();
    }
};



////////////////////////////////////////////////////////////////////////////////////////////////
// OLD CODE BELOW, KEPT FOR REFERENCE. DO NOT DELETE. //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

// document.getElementById("rollNumbers").onclick = () => {
//     const numbers = rollNumbers();
//     updateNumbersDisplay(numbers);
//     CalculateSum(numbers);
// }

// function rollNumbers() {
//     return numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1);
// }

// function updateNumbersDisplay() {
//     document.getElementById("number1").textContent = numbers[0];
//     document.getElementById("number2").textContent = numbers[1];
//     document.getElementById("number3").textContent = numbers[2];
//     document.getElementById("number4").textContent = numbers[3];
//     document.getElementById("number5").textContent = numbers[4];
//     document.getElementById("number6").textContent = numbers[5];
// }

// function CalculateSum(numbers) {
//     let sum = 0;
//     for (const number of numbers) {
//         sum += number;
//     }
//     document.getElementById("result").textContent = sum;
// }

// class DiceRoller {
//     roll() {
//         return Array.from(
//             { length: 6 },
//             () => Math.floor(Math.random() * 9) + 1
//         );
//     }
// }

// class ScoreCalculator {
//     calculateSum(numbers) {
//         let sum = 0;

//         for (const number of numbers) {
//             sum += number;
//         }

//         return sum;
//     }
// }

// class NumberDisplay {
//     show(numbers) {
//         document.getElementById("number1").textContent = numbers[0];
//         document.getElementById("number2").textContent = numbers[1];
//         document.getElementById("number3").textContent = numbers[2];
//         document.getElementById("number4").textContent = numbers[3];
//         document.getElementById("number5").textContent = numbers[4];
//         document.getElementById("number6").textContent = numbers[5];
//     }

//     showScore(score) {
//         document.getElementById("result").textContent = score;
//     }
// }

// const diceRoller = new DiceRoller();
// const scoreCalculator = new ScoreCalculator();
// const numberDisplay = new NumberDisplay();

// document.getElementById("rollNumbers").onclick = () => {
//     const numbers = diceRoller.roll();

//     numberDisplay.show(numbers);

//     const sum = scoreCalculator.calculateSum(numbers);
//     numberDisplay.showScore(sum);
// };