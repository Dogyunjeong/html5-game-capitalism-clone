import { DISPLAY_DECIMAL } from "../config"
import ItemTypes from "../types/Item.type"
import Wallet from "../services/Wallet"

class ItemPurchase {
  private _element: HTMLElement
  private _wallet: Wallet
  private _itemConfig: ItemTypes.ItemConfig

  private _isPurchasing: boolean = false
  private _onPurchased: () => void

  constructor(
    itemConfig: ItemTypes.ItemConfig,
    wallet: Wallet,
    onPurchased: () => void
  ) {
    this._itemConfig = itemConfig
    this._wallet = wallet
    this._onPurchased = onPurchased

    this._element = document.createElement("div")
    this._element.className = "item"
    this._element.onclick = this.handlePurchase
    const purchaseTextElem = document.createElement("div")
    purchaseTextElem.className = "purchase-text"
    purchaseTextElem.innerText = `purchase ${
      itemConfig.name
    } for ${itemConfig.price.toFixed(DISPLAY_DECIMAL)}`
    this._element.appendChild(purchaseTextElem)
  }

  private handlePurchase = async () => {
    if (this._isPurchasing) {
      return
    }
    this._isPurchasing = true
    const payed: boolean = await this._wallet.chargeMoney(
      this._itemConfig.price
    )
    if (!payed) {
      this._isPurchasing = false
      return
    }
    this._isPurchasing = false
    this._onPurchased()
  }

  public getElement = () => this._element
}

export default ItemPurchase
