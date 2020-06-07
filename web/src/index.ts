import ItemTypes from './types/Item.type'
import Wallet from './Wallet'
import { DISPLAY_DECIMAL, itemConfigs } from './config'
import Item from './components/Item'
import ItemPurchase from './components/ItemPurchase'
import CapitalismService from './services/capitalism.service'
import HireManager from './components/HireManager'
import Capitalism from './containers/Capitalism'




const init = () => {
    console.log('==== Initializing start ====')

    const wallet = Wallet.getInstance()
    const capitalismService = CapitalismService.getInstance()

    const app = document.getElementById('app')
    if (!app) {
        throw new Error('There is no #app element to attach game elements')
    }
    const capitalism = new Capitalism(
      capitalismService,
      wallet,
    )
    app.appendChild(capitalism.getElement())
    console.log('==== Initialized ====')
}

init()
