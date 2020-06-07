import CapitalismService from './services/capitalism.service'
class Wallet {
  private static _instance: Wallet
  private _capitalismService: CapitalismService
  private _currentMoney: number
  private _moneyListener: Array<(money: number) => void> = []
  private _lock: Boolean = false

  constructor (baseMoney: number) {
    this._capitalismService = CapitalismService.getInstance()
    this._currentMoney = this._capitalismService.loadMoney()
  }

  private _notifyMoneyChange = () => {
    this._capitalismService.updateMoney(this._currentMoney)
    this._moneyListener.forEach((fn) => fn(this._currentMoney))
  }

  public static getInstance = () => {
    if (!Wallet._instance) {
      Wallet._instance = new Wallet(1000)
    }
    return Wallet._instance
  }

  public getMoney = () => this._currentMoney.toFixed(2)

  public onAddMoney = (money: number) => {
    this._currentMoney += money
    this._notifyMoneyChange()
  }

  public subscribeMoney = (fn: (money: number) => void) => {
    this._moneyListener.push(fn)
  }

  // Simple locking
  public chargeMoney = async (money: number): Promise<boolean> => {
    if (this._lock) {
      return false
    }
    this._lock = true
    if (this._currentMoney < money) {
      this._lock = false
      return false
    }
    this._currentMoney -= money
    this._lock = false
    this._notifyMoneyChange()
    return true
  }
}

export default Wallet
