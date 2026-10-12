export class Odd_Squad {
    title = "Odd Squad";
    description = "Exactly four of the six digits are odd.";
    points = 10;
    rarity = "Common";

    check(numbers) {
        return numbers.filter(n => n % 2 !== 0).length === 4;
    }
}