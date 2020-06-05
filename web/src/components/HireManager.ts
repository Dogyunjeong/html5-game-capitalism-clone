import CapitalismService from '../services/capitalism.service'
import Wallet from '../Wallet'

class HireManager {
  private _capitalismService: CapitalismService
  private _wallet: Wallet
  private _element: HTMLElement

  constructor (
    capitalismService: CapitalismService,
    wallet: Wallet,
    closeHireManager: () => void
  ) {
    this._capitalismService = capitalismService
    this._wallet = wallet
    this._element = document.createElement('div')
    this._element.className = 'hire-manager-wrapper'

    const closeButton = document.createElement('button')
    closeButton.innerText = 'Close'
    closeButton.onclick = closeHireManager
    this._element.appendChild(closeButton)
    this.appendManagerElements()
  }

  private appendManagerElements = () => {
    const itemConfigs = this._capitalismService.loadItemConfigs()
    itemConfigs.forEach((itemConfig) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'hire-manager'
      wrapper.innerText = `Manager for ${itemConfig.name} (cost $${itemConfig.managerPrice})`
      wrapper.onclick = async () => {
        if (!itemConfig.purchased) {
          return
        }
        const isPaid = await this._wallet.chargeMoney(itemConfig.managerPrice)
        if (!isPaid) {
          return
        }
        this._capitalismService.hireManager(itemConfig.name)
        wrapper.onclick = null
        wrapper.className += ' purchased'
        wrapper.innerText = `Hired Manager for ${itemConfig.name}`
      }
      this._element.appendChild(wrapper)
    })
  }

  public getElement = (): HTMLElement => this._element
}

export default HireManager
