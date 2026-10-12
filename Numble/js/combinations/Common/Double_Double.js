export class Double_Double {
    title = "Double Double";
    description = "Exactly two different digits appear twice each. The other two digits appear once each and are different.";
    points = 10;
    rarity = "Common";

    check(numbers) {
        const counts = {};

        for (const number of numbers) {
            counts[number] = (counts[number] || 0) + 1;
        }

        return Object.values(counts).filter(x => x === 2).length === 2;
    }
}
