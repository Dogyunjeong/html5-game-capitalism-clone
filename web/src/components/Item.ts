import { DISPLAY_DECIMAL, itemConfigs } from '../config'
import ItemTypes from '../types/Item.type'
import Wallet from '../Wallet'
import CapitalismService from '../services/capitalism.service'

class Item {
  private _itemConfig: ItemTypes.ItemConfig
  private _wallet: Wallet
  private _capitalismService: CapitalismService

  private _element: HTMLElement
  private _titleElem: HTMLElement
  private _upgradeCostElem: HTMLElement
  private _revenueElem: HTMLElement
  private _progressElem: HTMLElement

  private _revenue: number
  private _upgradeCost: number
  private _isProducing: boolean = false
  private _currentProducing: Promise<void> = null

  constructor (
    itemConfig: ItemTypes.ItemConfig,
    wallet: Wallet,
    capitalismService: CapitalismService
  ) {
    // Copy Config
    this._itemConfig = { ...itemConfig }
    this._wallet = wallet
    this._revenue = itemConfig.revenueFn(itemConfig.level)
    this._upgradeCost = itemConfig.upgradeCostFn(itemConfig.level)
    this._capitalismService = capitalismService

    this._capitalismService.subscribeItemConfig(itemConfig.uuid, this.updateConfig)

    // Initializing component
    this._element = document.createElement('div')
    this._element.className = 'item'
    this._element.id = this._itemConfig.name

    this._titleElem = document.createElement('div')
    this._titleElem.className = 'name'
    this._titleElem.innerText = this._itemConfig.name
    this._titleElem.onclick = this.handleProduce

    const productionTime = document.createElement('div')
    productionTime.className = 'production-time'
    productionTime.innerText = `take: ${(this._itemConfig.productionTime / 1000).toFixed(0)} s`

    this._revenueElem = document.createElement('div')
    this._revenueElem.className = 'revenue'

    this._upgradeCostElem = document.createElement('div')
    this._upgradeCostElem.className = 'upgrade'
    this._upgradeCostElem.onclick = this.handleUpgrade

    this._progressElem = document.createElement('div')
    this._progressElem .className = 'progress'

    this._element.appendChild(this._titleElem)
    this._element.appendChild(this._revenueElem)
    this._element.appendChild(productionTime)
    this._element.appendChild(this._upgradeCostElem)
    this._element.appendChild(this._progressElem)
    if (this._itemConfig.hasManager) {
      this.initializeManager()
    }

    // Render update cost and revenue
    this.renderRevenueAndUpgradeCost()
  }

  private updateConfig = (itemConfig: ItemTypes.ItemConfig) => {
    console.log('updateConfig: ', itemConfig);
    if (this._itemConfig.name !== itemConfig.name) {
      throw new Error('Service updates with different item config')
    }
    this._itemConfig = itemConfig
    this.renderRevenueAndUpgradeCost()
    if (itemConfig.hasManager) {
      this.initializeManager()
    }
  }

  private initializeManager = async () => {
    this._titleElem.onclick = null
    this._titleElem.innerText = `${this._itemConfig.name} (has manager)`
    this._itemConfig = this._capitalismService.getItemConfigByUuid(this._itemConfig.uuid)
    const now = new Date()
    let initialProgressTime = 0
    if (this._currentProducing) {
      await this._currentProducing
    } else if (this._itemConfig.productionStartAt) {
      const underProducing = (this._itemConfig.productionStartAt.getTime() + this._itemConfig.productionTime) > now.getTime()
      if (underProducing) {
        initialProgressTime = now.getTime() - this._itemConfig.productionStartAt.getTime()
      }
    }
    const recursiveProducing = async (): Promise<() => void> => {
      await this._produceItem(initialProgressTime)
      initialProgressTime = 0
      return recursiveProducing()
    }
    recursiveProducing()
    return
  }

  private _produceItem = async (progressTime = 0): Promise<void> => new Promise((resolve) => {
    if (this._isProducing) {
      return
    }
    this._isProducing = true
    if (progressTime === 0) {
      this._capitalismService.updateItemProducingTime(this._itemConfig.uuid)
    }
    this._progressElem.innerText = `${(progressTime / 1000).toFixed(1)} s`
    const interval = setInterval(() => {
      progressTime += 100
      this._progressElem.innerText = `${(progressTime / 1000).toFixed(1)} s`
    }, 100)
    setTimeout(() => {
      clearInterval(interval)
      this._progressElem.innerText = ''
      this._wallet.onAddMoney(this._revenue)
      this._isProducing = false
      resolve()
    }, this._itemConfig.productionTime - progressTime)
  })

  private handleUpgrade = async () => {
    const isPayed = await this._wallet.chargeMoney(this._upgradeCost)
    if (!isPayed) {
      return
    }
    this._capitalismService.upgradeItem(this._itemConfig.uuid)
    this._itemConfig = { ...this._capitalismService.getItemConfigByUuid(this._itemConfig.uuid)}
    this.renderRevenueAndUpgradeCost()
    this._revenue = this._itemConfig.revenueFn(this._itemConfig.level)
    this._upgradeCost = this._itemConfig.upgradeCostFn(this._itemConfig.level)
  }

  private handleProduce = () => {
    this._currentProducing = this._produceItem()
  }

  private renderRevenueAndUpgradeCost () {
    this._upgradeCostElem.innerText =  `upgrade: ${this._upgradeCost.toFixed(DISPLAY_DECIMAL)}`
    this._revenueElem.innerText = `$ ${this._revenue.toFixed(DISPLAY_DECIMAL)}`
  }

  public getElement = () => this._element
}

export default Item
