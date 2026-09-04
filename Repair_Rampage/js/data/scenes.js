export const SCENES = {
  garage: {
    title: "Your Garage",
    location: "Your Garage",
    text: "Oil stains cover the floor. Another long day begins.",
    options: [{
        text: "Repair your first car",
        action: "repairCar",
        goto: "repairedCar",
        condition: state => !state.flags.repairedFirstCar
      },{
        text: "Repair a car",
        action: "repairCar",
        goto: "repairedCar",
        condition: state => state.flags.repairedFirstCar
      },{
        text: "Go to Parts Store",
        goto: "partsStore",
        condition: state => state.flags.repairedFirstCar
      }]
  },

  repairedCar: {
    title: "Car Repaired",
    location: "Your Garage",
    text: "You successfully repaired the car! The customer is happy and pays you.",
    options: [{
        text: "Repair another car",
        action: "repairCar"
      },{
        text: "Go to Parts Store",
        goto: "partsStore"
      }]
  },

  partsStore: {
    title: "Parts Store",
    location: "Parts Store",
    text: "Shelves packed with expensive components.",
    options: [{
        text: "Buy cheap parts (€100)",
        action: "buyParts",
        goto: "buyParts",
        condition: state => state.money >= 100
      },{
        text: "Return to garage",
        goto: "garage"
      }]
  },

  buyParts: {
    title: "Buying Parts",
    location: "Parts Store",
    text: "You buy some parts for your garage.",
    options: [{
        text: "Buy more parts (€100)",
        action: "buyParts",
        condition: state => state.money >= 100
      },{
        text: "Return to garage",
        goto: "garage"
      }]
  }
};