import ItemTypes from './types/Item.type'
import Item from './Item'
import Wallet from './Wallet'
import { DISPLAY_DECIMAL } from './config'
import ItemPurchase from './ItemPurchase'

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
        purchased: true,
        price: 0,
    },
    {
        name: 'Ice cream',
        productionTime: 3,
        revenueFn: generateRevenueFn(10, 5),
        upgradeCostFn: generateUpgradeCostFn(10, 0.6),
        level: 1,
        purchased: false,
        price: 1,
    },
    {
        name: 'Bicycle',
        productionTime: 10,
        revenueFn: generateRevenueFn(20, 10),
        upgradeCostFn: generateUpgradeCostFn(15, 0.6),
        level: 1,
        purchased: false,
        price: 10,
    },
    {
        name: 'Motor Bike',
        productionTime: 30,
        revenueFn: generateRevenueFn(30, 15),
        upgradeCostFn: generateUpgradeCostFn(20, 1),
        level: 1,
        purchased: false,
        price: 50,
    },
    {
        name: 'Car',
        productionTime: 60,
        revenueFn: generateRevenueFn(50, 25),
        upgradeCostFn: generateUpgradeCostFn(40, 2),
        level: 1,
        purchased: false,
        price: 100,
    }
]

type ItemMapProperty = {
    order: number,
    config: ItemTypes.ItemConfig,
    item?: Item,
    itemPurchase?: ItemPurchase,
}
const items: { [key: string]: ItemMapProperty} = {}
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
        totalMoney.innerText = `total: ${money.toFixed(DISPLAY_DECIMAL)}`
    })
    const itemsWrapper = document.createElement('div')
    app.appendChild(itemsWrapper)
    itemConfigs.forEach((itemConfig, idx) => {
        const currentProperty: ItemMapProperty = {
            config: itemConfig,
            order: idx
        }
        if (itemConfig.purchased) {
            currentProperty.item = new Item(
                itemConfig,
                wallet,
            )
            itemsWrapper.appendChild(currentProperty.item.getElement())
        } else {
            currentProperty.itemPurchase = new ItemPurchase(
                itemConfig,
                wallet,
                () => {
                    items[itemConfig.name].item = new Item(
                        itemConfig,
                        wallet,
                    )
                    itemsWrapper.replaceChild(
                        items[itemConfig.name].item.getElement(),
                        itemsWrapper.childNodes[idx]
                    )
                    console.log('idx: ', idx);
                    console.log('itemsWrapper: ', itemsWrapper);
                    console.log('itemsWrapper.children: ', itemsWrapper.children);
                }
            )
            itemsWrapper.appendChild(currentProperty.itemPurchase.getElement())
        }
        items[itemConfig.name] = currentProperty
    })
    console.log('==== Initialized ====')
}

init()
