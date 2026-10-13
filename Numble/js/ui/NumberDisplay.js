export class NumberDisplay {
    async show(numbers) {
        const promises = numbers.map((number, i) => {
            return new Promise((resolve) => {
                const element = document.getElementById(`number${i + 1}`);

            const interval = setInterval(() => {
                element.textContent = Math.floor(Math.random() * 10);
            }, 50);

                setTimeout(() => {
                    clearInterval(interval);
                    element.textContent = number;
                    resolve();
                }, 1000 + i * 500);
            });
        });

        await Promise.all(promises);
    }
}