namespace ItemTypes {
    export interface ItemConfig {
        name: string
        productionTime: number
        revenueFn: (level: number) => number
        upgradeCostFn: (level: number) => number
        level: number
        purchased: boolean
        price: number
        hasManager: boolean,
        managerPrice: number,
    }
}

export default ItemTypes
