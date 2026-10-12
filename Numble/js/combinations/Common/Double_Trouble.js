export class Double_Trouble {
    title = "Double Trouble";
    description = "A digit appears exactly twice anywhere in the six digits.";
    points = 10;
    rarity = "Common";

    check(numbers) {
        return numbers.some(number =>
            numbers.filter(n => n === number).length === 2
        );
    }
}