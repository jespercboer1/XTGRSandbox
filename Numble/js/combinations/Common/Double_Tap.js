export class Double_Tap {
    title = "Double Tap";
    description = "A digit appears exactly twice, directly next to itself.";
    points = 10;
    rarity = "Common";

    check(numbers) {
        for (let i = 0; i < numbers.length - 1; i++) {
            if (numbers[i] === numbers[i + 1]) {
                return true;
            }
        }
        return false;
    }
}