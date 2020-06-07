import ItemTypes from "./types/Item.type"

export const DISPLAY_DECIMAL = 2

const generateRevenueFn = (base: number, increasingRevenue: number) => (level: number): number => {
  return base + (level * increasingRevenue)
}
const generateUpgradeCostFn = (base: number, increasingRatio: number) => (level: number): number => {
  return base + (level * level * increasingRatio)
}

export const itemConfigs: ItemTypes.ItemConfig[] = [
  {
      uuid: 'uuid-lemon',
      name: 'Lemon',
      productionTime: 1000,
      revenueFn: generateRevenueFn(1, 0.8),
      upgradeCostFn: generateUpgradeCostFn(1, 0.6),
      level: 1,
      purchased: true,
      price: 0,
      hasManager: false,
      managerPrice: 100
  },
  {
      uuid: 'uuid-ice-cream',
      name: 'Ice cream',
      productionTime: 3000,
      revenueFn: generateRevenueFn(10, 5),
      upgradeCostFn: generateUpgradeCostFn(10, 0.6),
      level: 1,
      purchased: false,
      price: 1,
      hasManager: false,
      managerPrice: 500
  },
  {
      uuid: 'uuid-bicycle',
      name: 'Bicycle',
      productionTime: 10000,
      revenueFn: generateRevenueFn(20, 10),
      upgradeCostFn: generateUpgradeCostFn(15, 0.6),
      level: 1,
      purchased: false,
      price: 10,
      hasManager: false,
      managerPrice: 2000
  },
  {
      uuid: 'uuid-motor-bike',
      name: 'Motor Bike',
      productionTime: 60 * 60000,
      revenueFn: generateRevenueFn(30, 15),
      upgradeCostFn: generateUpgradeCostFn(20, 1),
      level: 1,
      purchased: false,
      price: 50,
      hasManager: false,
      managerPrice: 4000
  },
  {
      uuid: 'uuid-car',
      name: 'Car',
      productionTime: 60 * 60 * 5000,
      revenueFn: generateRevenueFn(50, 25),
      upgradeCostFn: generateUpgradeCostFn(40, 2),
      level: 1,
      purchased: false,
      price: 100,
      hasManager: false,
      managerPrice: 8000
  }
]
