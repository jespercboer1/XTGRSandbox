export class Even_Steven {
    title = "Even Steven";
    description = "Exactly four of the six digits are even.";
    points = 10;
    rarity = "Common";

    check(numbers) {
        return numbers.filter(n => n % 2 === 0).length === 4;
    }
}