export class Pocket_Change {
    title = "Pocket Change";
    description = "The sum of all six digits is less than 20.";
    points = 25;
    rarity = "Uncommon";

    check(numbers) {
        return numbers.reduce((acc, n) => acc + n, 0) < 20;
    }
}