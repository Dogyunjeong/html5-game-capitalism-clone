class Wallet {
  private static _instance: Wallet
  private _currentMoney: number
  private _moneyListener: Array<(money: number) => void> = []

  constructor (baseMoney: number) {
    this._currentMoney = baseMoney
  }

  private _notifyMoneyChange = () => {
    const wallet = Wallet.getInstance()
    wallet._moneyListener.forEach((fn) => fn(wallet._currentMoney))
  }

  public static getInstance = () => {
    if (!Wallet._instance) {
      Wallet._instance = new Wallet(0)
    }
    return Wallet._instance
  }

  public onAddMoney = (money: number) => {
    const wallet = Wallet.getInstance()
    wallet._currentMoney += money
    wallet._notifyMoneyChange()
  }

  public subscribeMoney = (fn: (money: number) => void) => {
    const wallet = Wallet.getInstance()
    wallet._moneyListener.push(fn)
  }
}

export default Wallet
