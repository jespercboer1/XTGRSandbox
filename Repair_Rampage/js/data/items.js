export const ITEMS = {
  wrench: {
    name: "Wrench",
    description: "A basic tool for repairs",
    cost: 20,
    sellValue: 15,
    compatibility: {},
    type: "tool"
  },
  tire: {
    name: "Tire",
    description: "Replacement tire for cars",
    cost: 50,
    sellValue: 35,
    compatibility: {size: "18", type: "all-season"},
    type: "part"
  },
  engine: {
    name: "Engine",
    description: "Car engine component",
    cost: 200,
    sellValue: 150,
    compatibility: {},
    type: "part"
  },
  door: {
    name: "Door",
    description: "Car door replacement",
    cost: 100,
    sellValue: 75,
    compatibility: {},
    type: "part"
  },
  battery: {
    name: "Battery",
    description: "Car battery for starting engines",
    cost: 80,
    sellValue: 60,
    compatibility: {},
    type: "part"
  },
  oil: {
    name: "Oil",
    description: "Engine oil for maintenance",
    cost: 30,
    sellValue: 20,
    compatibility: {},
    type: "consumable"
  },
  phone: {
    name: "Phone",
    description: "Your personal mechanic's phone for calls and contacts.",
    cost: 0,
    sellValue: 0,
    compatibility: {},
    type: "personal"
  }
  // Add more items here as needed
};