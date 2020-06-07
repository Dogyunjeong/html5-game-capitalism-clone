import Wallet from "./services/Wallet"
import CapitalismService from "./services/capitalism.service"
import Capitalism from "./containers/Capitalism"

const init = () => {
  console.log("==== Initializing start ====")

  const wallet = Wallet.getInstance()
  const capitalismService = CapitalismService.getInstance()

  const app = document.getElementById("app")
  if (!app) {
    throw new Error("There is no #app element to attach game elements")
  }
  const capitalism = new Capitalism(capitalismService, wallet)
  app.appendChild(capitalism.getElement())
  console.log("==== Initialized ====")
}

init()
