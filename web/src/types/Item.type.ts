namespace ItemTypes {
    export interface ItemConfig {
        uuid: string
        name: string
        productionTime: number
        revenueFn: (level: number) => number
        upgradeCostFn: (level: number) => number
        level: number
        purchased: boolean
        price: number
        hasManager: boolean,
        managerPrice: number,
        productionStartAt?: Date
    }
}

export default ItemTypes
