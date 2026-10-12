export class One_Pair_Wonder {
    title = "One Pair Wonder";
    description = "One digit appears twice, and all other digits are different.";
    points = 10;
    rarity = "Common";

    check(numbers) {
        return new Set(numbers).size === 5;
    }
}