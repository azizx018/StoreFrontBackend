
import Client from "../database";

export type JoinProduct = {
    orderid: number,
    productid: number,
    product: string,
    quantity: number
}

export class DashboardService {
    async joinProductsForUser(userid: number): Promise<JoinProduct[]> {
        try {
            const conn = await Client.connect()

            const sqlOrdersForUser = 'SELECT ' +
                'O.id AS orderid, P.name AS product, OP.quantity, P.id AS productid ' +
                'FROM Orders O ' +
                'JOIN Order_products OP ON OP.OrderId = O.id ' +
                'JOIN Products P ON P.id = OP.ProductId ' +
                'WHERE O.userId = $1 AND O.status = \'active\''
            const ordersForUser = await conn.query(sqlOrdersForUser, [userid])

            conn.release()
            return ordersForUser.rows

        } catch (err) {
            throw new Error(`Could not get orders and products for userid ${userid}. Error ${err}`)
        }
    }
}