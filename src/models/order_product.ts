import Client from "../database";


export type OrderProduct = {
    productid: number,
    quantity: number,
    ProductName?: string | null
}