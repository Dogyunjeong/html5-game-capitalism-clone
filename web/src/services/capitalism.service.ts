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

  private _notifyItemConfigUpdated = (itemName: string, itemConfig: ItemTypes.ItemConfig) => {
    this._itemConfigListenersMap[itemName].forEach((fn) => {
      fn(itemConfig)
    })
  }

  public loadItemConfigs = () => this._itemConfigs

  public subscribeItemConfig = (itemName: string, fn: (itemConfig: ItemTypes.ItemConfig) => void) => {
    if (!this._itemConfigListenersMap[itemName]) {
      this._itemConfigListenersMap[itemName] = []
    }
    this._itemConfigListenersMap[itemName].push(fn)
  }

  public hireManager = (itemName: string) => {
    const itemConfig = this._itemConfigs.find((itemConfig) => itemConfig.name === itemName)
    if (!itemConfig) {
      throw new Error(`There is no item config for ${itemName}`)
    }
    if (itemConfig.hasManager) {
      throw new Error(`Already have a manager for ${itemName}`)
    }
    itemConfig.hasManager = true
    this._notifyItemConfigUpdated(itemName, itemConfig)
  }
}

export default CapitalismService
