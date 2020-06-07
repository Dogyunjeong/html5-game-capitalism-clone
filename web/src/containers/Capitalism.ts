import ItemTypes from "../types/Item.type"
import Item from "../components/Item"
import ItemPurchase from "../components/ItemPurchase"
import CapitalismService from "../services/capitalism.service"
import Wallet from "../Wallet"
import { DISPLAY_DECIMAL, itemConfigs } from "../config"
import HireManager from "../components/HireManager"
type ItemMapProperty = {
  order: number
  itemConfig: ItemTypes.ItemConfig
  item?: Item
  itemPurchase?: ItemPurchase
}

class Capitalism {
  private _element: HTMLElement = null
  private _totalMoneyElem: HTMLElement = null
  private _itemsWrapperElem: HTMLElement = null
  private _itemConfigs: ItemTypes.ItemConfig[] = []
  private _items: { [key: string]: ItemMapProperty } = {}

  private _capitalismService: CapitalismService = null
  private _wallet: Wallet = null
  constructor(
    capitalismService: CapitalismService = CapitalismService.getInstance(),
    wallet: Wallet = Wallet.getInstance()
  ) {
    this._capitalismService = capitalismService
    this._wallet = wallet
    this._totalMoneyElem = this.renderTotalMoney()
    this._itemsWrapperElem = this.renderItemWrapper()
    this._element = document.createElement('div')
    this._element.appendChild(this._totalMoneyElem)
    this._element.appendChild(this._itemsWrapperElem)
    this._element.appendChild(this.renderHireManagerButton())
  }

  private generateItem = (itemConfig: ItemTypes.ItemConfig) => {
    const item = new Item(itemConfig, this._wallet, this._capitalismService)
    return item
  }

  private generatePurchaseItem = (itemConfig: ItemTypes.ItemConfig) => {
    const handlePurchaseItem = () => {
      this._capitalismService.purchaseItem(itemConfig.uuid)
      const updatedItemConfig = this._capitalismService.getItemConfigByUuid(
        itemConfig.uuid
      )
      const currentProperty: ItemMapProperty = this._items[itemConfig.uuid]
      currentProperty.itemConfig = updatedItemConfig
      this._items[itemConfig.uuid].item = new Item(
        updatedItemConfig,
        this._wallet,
        this._capitalismService
      )
      this._itemsWrapperElem.replaceChild(
        this._items[itemConfig.uuid].item.getElement(),
        this._itemsWrapperElem.childNodes[currentProperty.order]
      )
    }

    const itemPurchase = new ItemPurchase(
      itemConfig,
      this._wallet,
      handlePurchaseItem
    )
    return itemPurchase
  }

  private renderItemWrapper = () => {
    const itemsWrapperElem = document.createElement("div")
    const itemConfigs = this._capitalismService.loadItemConfigs()
    itemConfigs.forEach((itemConfig, idx) => {
      const currentProperty: ItemMapProperty = {
        itemConfig: itemConfig,
        order: idx,
      }
      if (itemConfig.purchased) {
        const item = this.generateItem(itemConfig)
        currentProperty.item = item
        itemsWrapperElem.appendChild(item.getElement())
      } else {
        const itemPurchase = this.generatePurchaseItem(itemConfig)
        currentProperty.itemPurchase = itemPurchase
        itemsWrapperElem.appendChild(itemPurchase.getElement())
      }
      this._items[itemConfig.uuid] = currentProperty
    })
    return itemsWrapperElem
  }

  private renderTotalMoney = () => {
    const totalMoneyElem = document.createElement("div")
    totalMoneyElem.className = "total money"
    totalMoneyElem.innerText = `total: ${this._wallet.getMoney()}`
    this._wallet.subscribeMoney((money: number) => {
      totalMoneyElem.innerText = `total: ${money.toFixed(
        DISPLAY_DECIMAL
      )}`
    })
    return totalMoneyElem
  }

  private renderHireManagerButton = () => {
    const hireManagerButton = document.createElement('button')
    hireManagerButton.className = 'hire-manager-button'
    hireManagerButton.innerText = 'Hire Manager'
    hireManagerButton.onclick = () => {
        let hireManagerElem: HTMLElement
        const hireManager = new HireManager(
            this._capitalismService,
            this._wallet,
            () => {
                this._element.removeChild(hireManagerElem)
            }
        )
        hireManagerElem = hireManager.getElement()
        this._element.appendChild(hireManagerElem)
    }
    return hireManagerButton
  }

  public getElement = (): HTMLElement => this._element
}

export default Capitalism
