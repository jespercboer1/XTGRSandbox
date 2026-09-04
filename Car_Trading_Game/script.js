// script.js
const carNames = ["Ford", "Toyota", "BMW", "Mercedes", "Honda"];

function generateRandomCar() {
    const name = carNames[Math.floor(Math.random() * carNames.length)];
    const price = Math.floor(Math.random() * 10000) + 5000;
    const km = Math.floor(Math.random() * 200000);
    const damage = Math.floor(Math.random() * 101);
    return { name, price, km, damage };
}

function calculateSellPrice(car) {
    return car.price + (car.price * ((100 - car.damage) / 100)) + (car.price * (200000 - car.km) / 200000);
}

document.addEventListener('DOMContentLoaded', () => {
    let playerMoney = 10000;
    let playerCars = [];
    let playerCarSlots = 2;
    const shopCars = [];

    // Load sounds
    const buySound = document.getElementById('buy-sound');
    const sellSound = document.getElementById('sell-sound');
    const slotSound = document.getElementById('slot-sound');

    function updateUI() {
        const playerCarsList = document.getElementById('player-cars-list');
        const shopCarsList = document.getElementById('shop-cars-list');
        const playerMoneyDisplay = document.getElementById('player-money');
        const playerCarSlotsDisplay = document.getElementById('player-car-slots');


        playerMoneyDisplay.textContent = playerMoney;
        playerCarSlotsDisplay.textContent = playerCarSlots;

        playerCarsList.innerHTML = '';
        playerCars.forEach((car, index) => {
            const carElement = document.createElement('div');
            carElement.classList.add('car-item');
            carElement.innerHTML = `
                <p><strong>Name:</strong> ${car.name}</p>
                <p><strong>Price:</strong> $${car.price}</p>
                <p><strong>KM:</strong> ${car.km}</p>
                <p><strong>Damage:</strong> ${car.damage}%</p>
            `;
            playerCarsList.appendChild(carElement);
        });

        shopCarsList.innerHTML = '';
        shopCars.forEach((car, index) => {
            const carElement = document.createElement('div');
            carElement.classList.add('car-item');
            carElement.innerHTML = `
                <p><strong>Name:</strong> ${car.name}</p>
                <p><strong>Price:</strong> $${car.price}</p>
                <p><strong>KM:</strong> ${car.km}</p>
                <p><strong>Damage:</strong> ${car.damage}%</p>
            `;
            const buyButton = document.createElement('button');
            buyButton.innerText = 'Buy';
            buyButton.addEventListener('click', () => buyCar(index));
            carElement.appendChild(buyButton);
            shopCarsList.appendChild(carElement);
        });
    }

    function buyCar(index) {
        const car = shopCars[index];
        if (playerCars.length < playerCarSlots && playerMoney >= car.price) {
            playerMoney -= car.price;
            playerCars.push(car);
            shopCars.splice(index, 1);
            updateUI();
            buySound.play(); // Play buy sound
        } else {
            alert('Not enough money or car slots.');
        }
    }

    function openShop() {
        playerCars.forEach(car => {
            playerMoney += Math.floor(calculateSellPrice(car));
        });
        playerCars = [];
        updateUI();
        sellSound.play(); // Play sell sound
        alert('All cars sold!');
    }

    function nextDay() {
        for (let i = 0; i < 5; i++) {
            shopCars.push(generateRandomCar());
        }
        updateUI();
    }

    function buyCarSlot() {
        const slotCost = 500;
        if (playerMoney >= slotCost) {
            playerMoney -= slotCost;
            playerCarSlots += 1;
            updateUI();
            slotSound.play(); // Play slot purchase sound
        } else {
            alert('Not enough money to buy a car slot.');
        }
    }

    document.getElementById('buy-slot').addEventListener('click', buyCarSlot);
    document.getElementById('open-shop').addEventListener('click', openShop);
    document.getElementById('next-day').addEventListener('click', nextDay);

    nextDay();
});
