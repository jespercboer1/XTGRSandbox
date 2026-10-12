export class Fours_Company {
    title = "Four's Company";
    description = "Exactly four different digits appear in the roll.";
    points = 10;
    rarity = "Common";

    check(numbers) {
        return new Set(numbers).size === 4;
    }
}