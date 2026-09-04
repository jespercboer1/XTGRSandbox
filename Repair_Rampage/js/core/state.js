export const gameState = {
  day: 1,
  time: {
    hour: 8,
    minute: 0
  },

  money: 500,
  debt: 10000,

  stamina: 100,

  shop: {
    level: 1,
    reputation: 0
  },

  employees: [],

  shopInventory: {
    wrench: 5,
    tire: 10,
    engine: 2,
    door: 4,
    battery: 6,
    oil: 20
  },

  personalInventory: {
    phone: 1
  },

  currentScene: "garage",

  flags: {},   // story memory, e.g. { metMayor: true }
};