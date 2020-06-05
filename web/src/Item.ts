import ItemTypes from './types/Item.type'

class Item {
  private _itemConfig: ItemTypes.ItemConfig

  private _onAddMoney: (money: number) => void

  private _parent: HTMLElement
  private _wrapper: HTMLElement
  private _upgradeCostElem: HTMLElement
  private _revenueElem: HTMLElement

  private _revenue: number
  private _upgradeCost: number
  private _isProducing: boolean = false
  private _productionStartAt: Date | null = null

  constructor (
    itemConfig: ItemTypes.ItemConfig,
    parent: HTMLElement,
    onAddMoney: (money: number) => void
  ) {
    this._itemConfig = itemConfig
    this._revenue = itemConfig.revenueFn(itemConfig.level)
    this._upgradeCost = itemConfig.upgradeCostFn(itemConfig.level)
    this._onAddMoney = onAddMoney
    this._parent = parent

    // Initializing component
    const revenue: number = this._itemConfig.revenueFn(this._itemConfig.level)
    const upgradeCost: number = this._itemConfig.upgradeCostFn(this._itemConfig.level)
    const wrapper = document.createElement('div')
    wrapper.className = 'item'
    wrapper.id = this._itemConfig.name

    const titleElem = document.createElement('div')
    titleElem.className = 'name'
    titleElem.innerText = this._itemConfig.name
    titleElem.onclick = this._produce

    const revenueElem = document.createElement('div')
    revenueElem.className = 'revenue'
    revenueElem.innerText = `$ ${revenue.toString()}`

    const productionTime = document.createElement('div')
    productionTime.className = 'production-time'
    productionTime.innerText = `take: ${this._itemConfig.productionTime} s`

    const upgradeCostElem = document.createElement('div')
    upgradeCostElem.className = 'upgrade'
    upgradeCostElem.onclick = this._upgrade
    upgradeCostElem.innerText = `upgrade: ${upgradeCost}`

    this._wrapper = wrapper
    this._upgradeCostElem = upgradeCostElem
    this._revenueElem = revenueElem
    wrapper.appendChild(titleElem)
    wrapper.appendChild(revenueElem)
    wrapper.appendChild(productionTime)
    wrapper.appendChild(upgradeCostElem)
    this._parent.appendChild(wrapper)
  }

  private _upgrade = () => {
    const level = this._itemConfig.level + 1
    this._itemConfig = {
      ...this._itemConfig,
      level,
    }
    this._updateRender()
  }

  private _produce = () => {
    if (this._isProducing) {
      return
    }
    this._productionStartAt = new Date()
    setTimeout(() => {
      this._onAddMoney(this._revenue)
    }, this._itemConfig.productionTime * 1000)
  }

  private _updateRender () {
    this._revenue = this._itemConfig.revenueFn(this._itemConfig.level)
    this._upgradeCost = this._itemConfig.upgradeCostFn(this._itemConfig.level)
    this._revenueElem.innerText = this._revenue.toString()
    this._upgradeCostElem.innerText = this._upgradeCost.toString()
  }
}

export default Item
