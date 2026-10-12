export class AllCombinationsListDisplay {
    constructor(combinationsRegistry) {
        this.combinationsRegistry = combinationsRegistry;
        this.element = document.getElementById("allCombinations");
        
        for (const combination of this.combinationsRegistry) {
            const item = document.createElement("div");
            item.textContent = `${combination.title} (+${combination.points})`;
            this.element.appendChild(item);
        }

        console.log("AllCombinationsListDisplay initialized with combinations:", this.combinationsRegistry);
    }

    show() {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }
}