export class ScoreCalculator {
    calculate(combinations) {
        let score = 0;

        for (const combination of combinations) {
            score += combination.points;
        }

        return score;
    }
}