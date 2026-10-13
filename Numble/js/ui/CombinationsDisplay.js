export class CombinationsDisplay {
    show(combination) {
        const item = document.createElement("div");

        item.textContent = `${combination.title} (+${combination.points})`;

        document.getElementById("combinations").appendChild(item);
    }
}