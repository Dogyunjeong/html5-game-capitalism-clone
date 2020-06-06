import ItemTypes from './types/Item.type'
import Wallet from './Wallet'
import { DISPLAY_DECIMAL, itemConfigs } from './config'
import Item from './components/Item'
import ItemPurchase from './components/ItemPurchase'
import CapitalismService from './services/capitalism.service'
import HireManager from './components/HireManager'

type ItemMapProperty = {
    order: number,
    config: ItemTypes.ItemConfig,
    item?: Item,
    itemPurchase?: ItemPurchase,
}


const init = () => {
    console.log('==== Initializing start ====')

    const items: { [key: string]: ItemMapProperty} = {}
    const wallet = Wallet.getInstance()
    const capitalismService = CapitalismService.getInstance()

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
    const itemConfigs = capitalismService.loadItemConfigs()
    itemConfigs.forEach((itemConfig, idx) => {
        const currentProperty: ItemMapProperty = {
            config: itemConfig,
            order: idx
        }
        if (itemConfig.purchased) {
            currentProperty.item = new Item(
                itemConfig,
                wallet,
                capitalismService,
            )
            itemsWrapper.appendChild(currentProperty.item.getElement())
        } else {
            currentProperty.itemPurchase = new ItemPurchase(
                itemConfig,
                wallet,
                () => {
                    capitalismService.purchaseItem(itemConfig.uuid)
                    items[itemConfig.uuid].item = new Item(
                        itemConfig,
                        wallet,
                        capitalismService,
                    )
                    itemsWrapper.replaceChild(
                        items[itemConfig.uuid].item.getElement(),
                        itemsWrapper.childNodes[idx]
                    )
                }
            )
            itemsWrapper.appendChild(currentProperty.itemPurchase.getElement())
        }
        items[itemConfig.uuid] = currentProperty
    })

    const hireManagerButton = document.createElement('button')
    hireManagerButton.className = 'hire-manager-button'
    hireManagerButton.innerText = 'Hire Manager'
    hireManagerButton.onclick = () => {
        let hireManagerElem: HTMLElement
        const hireManager = new HireManager(
            capitalismService,
            wallet,
            () => {
                app.removeChild(hireManagerElem)
            }
        )
        hireManagerElem = hireManager.getElement()
        app.appendChild(hireManagerElem)
    }
    app.appendChild(hireManagerButton)
    console.log('==== Initialized ====')
}

init()
