export class ClearDisplay {
    clear() {
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`number${i}`).textContent = "#";
        }
        document.getElementById("result").textContent = "";
        document.getElementById("combinations").innerHTML = "";
    }
}