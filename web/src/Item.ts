import ItemTypes from './types/Item.type'

class Item {
  private _itemConfig: ItemTypes.ItemConfig

  private _onAddMoney: (money: number) => void

  private _parent: HTMLElement
  private _wrapper: HTMLElement
  private _upgradeCostElem: HTMLElement
  private _revenueElem: HTMLElement
  private _progressElem: HTMLElement

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
    this._wrapper = document.createElement('div')
    this._wrapper.className = 'item'
    this._wrapper.id = this._itemConfig.name

    const titleElem = document.createElement('div')
    titleElem.className = 'name'
    titleElem.innerText = this._itemConfig.name
    titleElem.onclick = this.handleProduce

    const productionTime = document.createElement('div')
    productionTime.className = 'production-time'
    productionTime.innerText = `take: ${this._itemConfig.productionTime} s`

    this._revenueElem = document.createElement('div')
    this._revenueElem.className = 'revenue'

    this._upgradeCostElem = document.createElement('div')
    this._upgradeCostElem.className = 'upgrade'
    this._upgradeCostElem.onclick = this.handleUpgrade

    this._progressElem = document.createElement('div')
    this._progressElem .className = 'progress'

    this._wrapper.appendChild(titleElem)
    this._wrapper.appendChild(this._revenueElem)
    this._wrapper.appendChild(productionTime)
    this._wrapper.appendChild(this._upgradeCostElem)
    this._wrapper.appendChild(this._progressElem)
    this._parent.appendChild(this._wrapper)

    // Render update cost and revenue
    this.renderRevenueAndUpgradeCost()
  }

  private handleUpgrade = () => {
    const level = this._itemConfig.level + 1
    this._itemConfig = {
      ...this._itemConfig,
      level,
    }
    this.renderRevenueAndUpgradeCost()
    this._revenue = this._itemConfig.revenueFn(this._itemConfig.level)
    this._upgradeCost = this._itemConfig.upgradeCostFn(this._itemConfig.level)
  }

  private handleProduce = () => {
    if (this._isProducing) {
      return
    }
    this._isProducing = true
    this._productionStartAt = new Date()
    let progressTime = 0
    this._progressElem.innerText = `${(progressTime / 1000).toFixed(1)} s`
    const interval = setInterval(() => {
      progressTime += 100
      this._progressElem.innerText = `${(progressTime / 1000).toFixed(1)} s`
    }, 100)
    setTimeout(() => {
      clearInterval(interval)
      this._progressElem.innerText = ''
      this._onAddMoney(this._revenue)
      this._isProducing = false
    }, this._itemConfig.productionTime * 1000)
  }

  private renderRevenueAndUpgradeCost () {
    this._upgradeCostElem.innerText =  `upgrade: ${this._upgradeCost.toString()}`
    this._revenueElem.innerText = `$ ${this._revenue.toString()}`
  }
}

export default Item
