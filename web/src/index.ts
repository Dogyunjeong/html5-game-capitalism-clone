import ItemTypes from './types/Item.type'
import Item from './Item'
import Wallet from './Wallet'

const generateRevenueFn = (base: number, increasingRevenue: number) => (level: number): number => {
    return base + (level * increasingRevenue)
}
const generateUpgradeCostFn = (base: number, increasingRatio: number) => (level: number): number => {
    return base + (level * level * increasingRatio)
}

const itemConfigs: ItemTypes.ItemConfig[] = [
    {
        name: 'Lemon',
        productionTime: 1,
        revenueFn: generateRevenueFn(1, 0.8),
        upgradeCostFn: generateUpgradeCostFn(1, 0.6),
        level: 1,
    },
    {
        name: 'Ice cream',
        productionTime: 3,
        revenueFn: generateRevenueFn(10, 5),
        upgradeCostFn: generateUpgradeCostFn(10, 0.6),
        level: 1,
    }
]

const items: { [key: string]: Item} = {}
const wallet = Wallet.getInstance()


const init = () => {
    console.log('==== Initializing start ====')
    const app = document.getElementById('app')
    if (!app) {
        throw new Error('There is no #app element to attach game elements')
    }
    const totalMoney = document.createElement('div')
    totalMoney.className = 'total money'
    totalMoney.innerText = `total: 0`
    app.appendChild(totalMoney)
    wallet.subscribeMoney((money: number) => {
        totalMoney.innerText = `total: ${money}`
    })
    itemConfigs.forEach((itemConfig) => {
        items[itemConfig.name] = new Item(
            itemConfig,
            app,
            (money:number) => wallet.onAddMoney(money),
        )
    })
    console.log('==== Initialized ====')
}

init()
