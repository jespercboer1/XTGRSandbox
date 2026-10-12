export class CombinationsDisplay {
    show(combinations) {
        const element = document.getElementById("combinations");

        element.innerHTML = "";

        for (const combination of combinations) {
            const item = document.createElement("div");

            item.textContent = `${combination.title} (+${combination.points})`;

            element.appendChild(item);
        }
    }
}