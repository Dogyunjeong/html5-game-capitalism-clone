import ItemTypes from '../types/Item.type'
import { itemConfigs } from '../config'

class CapitalismService {

  private static _instance: CapitalismService

  public static getInstance (): CapitalismService {
    if (!CapitalismService._instance) {
      CapitalismService._instance = new CapitalismService()
    }
    return CapitalismService._instance
  }

  private _itemConfigs: ItemTypes.ItemConfig[] = []
  private _itemConfigListenersMap: {
    [key: string]: Array<(itemConfig: ItemTypes.ItemConfig) => void>,
  } = {}

  constructor () {
    this._itemConfigs = itemConfigs
  }

  private _notifyItemConfigUpdated = (itemConfig: ItemTypes.ItemConfig) => {
    if (!this._itemConfigListenersMap[itemConfig.uuid]) {
      return
    }
    this._itemConfigListenersMap[itemConfig.uuid].forEach((fn) => {
      fn(itemConfig)
    })
  }

  public loadItemConfigs = () => this._itemConfigs

  public getItemConfigByUuid = (uuid: string) => {
    const itemConfig = this._itemConfigs.find((itemConfig) => itemConfig.uuid === uuid)
    return itemConfig
  }

  public subscribeItemConfig = (uuid: string, fn: (itemConfig: ItemTypes.ItemConfig) => void) => {
    if (!this._itemConfigListenersMap[uuid]) {
      this._itemConfigListenersMap[uuid] = []
    }
    this._itemConfigListenersMap[uuid].push(fn)
  }

  public purchaseItem = (uuid: string) => {
    const itemConfig = this._itemConfigs.find((itemConfig) => itemConfig.uuid === uuid)
    itemConfig.purchased = true
    this._notifyItemConfigUpdated(itemConfig)
  }

  public hireManager = (uuid: string) => {
    const itemConfig = this._itemConfigs.find((itemConfig) => itemConfig.uuid === uuid)
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
