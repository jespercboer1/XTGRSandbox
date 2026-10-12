export class CombinationsChecker {
    constructor(combinations) {
        this.combinations = combinations;
        console.log("CombinationsChecker initialized with combinations:", this.combinations);
    }

    check(numbers) {
        return this.combinations.filter(
            combination => combination.check(numbers)
        );
    }
}