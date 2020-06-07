import ItemTypes from '../types/Item.type'
import { itemConfigs } from '../config'

const STORE_KEY = 'capitalism-service-local-storage-key'
const START_MONEY = 1000


type ItemProducingScheduled = {
  [key: string]: Date
}

type StoredData = {
  itemConfigs: ItemTypes.ItemConfig[]
  money: number
  itemProducingScheduled: { [key: string]: Date | string }
}

class CapitalismService {

  private static _instance: CapitalismService

  public static getInstance (): CapitalismService {
    if (!CapitalismService._instance) {
      CapitalismService._instance = new CapitalismService()
    }
    return CapitalismService._instance
  }

  private _money: number
  private _itemConfigs: ItemTypes.ItemConfig[] = []
  private _itemProducingScheduled: ItemProducingScheduled = {}
  private _itemConfigListenersMap: {
    [key: string]: Array<(itemConfig: ItemTypes.ItemConfig) => void>,
  } = {}

  constructor () {
    this._itemConfigs = itemConfigs
    this._money = START_MONEY
    this._loadData()
    window.onbeforeunload = () => {
      this._saveData()
    }
  }

  private _notifyItemConfigUpdated = (itemConfig: ItemTypes.ItemConfig) => {
    if (!this._itemConfigListenersMap[itemConfig.uuid]) {
      return
    }
    this._itemConfigListenersMap[itemConfig.uuid].forEach((fn) => {
      fn(itemConfig)
    })
  }


  private _loadData = () => {
    const jsonData = localStorage.getItem(STORE_KEY)
    if (!jsonData) {
      return
    }
    const storeData: StoredData = JSON.parse(jsonData)

    const loadedItemConfigs: ItemTypes.ItemConfig[] = []
    let itemProducingScheduled: ItemProducingScheduled = {}
    let additionalMoney = 0
    storeData.itemConfigs.forEach((storedItemConfig) => {
      const initialItemConfig = itemConfigs.find((itemConfig) => itemConfig.uuid === storedItemConfig.uuid)
      const itemConfig = {
        ...storedItemConfig,
        revenueFn: initialItemConfig.revenueFn,
        upgradeCostFn: initialItemConfig.upgradeCostFn,
      }
      // TODO: It leads the bug that when closed browser all item production can be done one more time
      const itemProducedAt = new Date(storedItemConfig.productionStartAt)
      const now = new Date()
      const timeDiff: number = (now.getTime() - itemProducedAt.getTime()) / 1000 // make it as seconds
      let newSchedule = null
      let currentProductionSeconds = null
      if (itemConfig.hasManager) {
        const producedAmount = Math.floor(timeDiff / itemConfig.productionTime)
        newSchedule = new Date(now.getTime() - (timeDiff % itemConfig.productionTime))
        additionalMoney += producedAmount * itemConfig.revenueFn(itemConfig.level)
      } else {
        const finished = timeDiff >= itemConfig.productionTime
        if (finished) {
          additionalMoney += itemConfig.revenueFn(itemConfig.level)
          newSchedule = null
        } else {
          newSchedule = itemProducedAt
        }
      }
      itemConfig.productionStartAt = newSchedule
      loadedItemConfigs.push(itemConfig)
    })
    this._itemConfigs = loadedItemConfigs,
    this._money = storeData.money + additionalMoney
  }

  private _saveData = () => {
    const storedData: StoredData = {
      itemConfigs: this._itemConfigs,
      money: this._money,
      itemProducingScheduled: this._itemProducingScheduled
    }
    console.log('storing data: ', storedData)
    localStorage.setItem(STORE_KEY, JSON.stringify(storedData))
  }

  public loadItemConfigs = () => this._itemConfigs

  public loadMoney = () => this._money

  public updateMoney = (money: number) => {
    this._money = money
  }

  public updateItemProducingTime = (itemUuid: string, date: Date = new Date()) => {
    const itemConfig = this._itemConfigs.find((itemConfig) => itemConfig.uuid === itemUuid)
    itemConfig.productionStartAt = date
  }

  public getItemConfigByUuid = (itemUuid: string) => {
    const itemConfig = this._itemConfigs.find((itemConfig) => itemConfig.uuid === itemUuid)
    return itemConfig
  }

  public subscribeItemConfig = (itemUuid: string, fn: (itemConfig: ItemTypes.ItemConfig) => void) => {
    if (!this._itemConfigListenersMap[itemUuid]) {
      this._itemConfigListenersMap[itemUuid] = []
    }
    this._itemConfigListenersMap[itemUuid].push(fn)
  }

  public purchaseItem = (itemUuid: string) => {
    const itemConfig = this._itemConfigs.find((itemConfig) => itemConfig.uuid === itemUuid)
    itemConfig.purchased = true
    this._notifyItemConfigUpdated(itemConfig)
  }

  public upgradeItem = (itemUuid: string) => {
    const itemConfig = this._itemConfigs.find((itemConfig) => itemConfig.uuid === itemUuid)
    itemConfig.level += 1
  }

  public hireManager = (itemUuid: string) => {
    const itemConfig = this._itemConfigs.find((itemConfig) => itemConfig.uuid === itemUuid)
    if (!itemConfig) {
      throw new Error(`There is no item config for ${itemConfig.name}`)
    }
    if (itemConfig.hasManager) {
      throw new Error(`Already have a manager for ${itemConfig.name}`)
    }
    itemConfig.hasManager = true
    this._notifyItemConfigUpdated(itemConfig)
  }
}

export default CapitalismService
