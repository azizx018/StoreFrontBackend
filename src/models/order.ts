import Client from "../database";
import verifyAuthToken from "../handlers/verify";
import { OrderProduct } from "./order_product";
import { DashboardService, JoinProduct } from "../services/dashboard";

export type Order = {
    id: number,
    userid: number,
    status: string,
    OrderProducts?: OrderProduct[] | null
}



export class OrderStore {
    async ordersForUser(userid: number): Promise<Order[]> {
        try {
            const conn = await Client.connect()

            const orders: Order[] = []

            const dashboardSvc: DashboardService = new DashboardService()
            const joinedOrderProducts = await dashboardSvc.joinProductsForUser(userid)

            joinedOrderProducts.forEach((orderProductQuantity: JoinProduct) => {
                const ordersWithSameId = orders.filter(order => order.id === orderProductQuantity.orderid)
                const orderExists = ordersWithSameId.length > 0

                if (!orderExists) {

                    const newOrder: Order = {
                        id: orderProductQuantity.orderid,
                        userid: userid,
                        status: 'active',
                        OrderProducts: []
                    }

                    joinedOrderProducts.forEach((oPQ: JoinProduct) => {
                        if (newOrder.id === oPQ.orderid) {
                            const orderProduct: OrderProduct = {
                                productid: oPQ.productid,
                                quantity: oPQ.quantity,
                                ProductName: oPQ.product
                            }

                            newOrder.OrderProducts?.push(orderProduct)
                        }
                    });
                    orders.push(newOrder)
                }

            });
            conn.release()
            return orders
        } catch (err) {
            throw new Error(`Could not find current user ${userid}. Error ${err}`)
        }
    }
    async create(o: Order): Promise<Order> {
        try {
            let conn = await Client.connect()

            const sqlInsertOrder = 'INSERT INTO orders (userId, status) VALUES($1, $2) RETURNING *'
            const sqlInsertOrderResult = await conn.query(sqlInsertOrder, [o.userid, o.status])
            const order = sqlInsertOrderResult.rows[0]

            const sqlInsertOrderProduct = 'INSERT INTO order_products (quantity, productId, orderId) VALUES($1, $2, $3)'

            if (o.OrderProducts !== undefined && o.OrderProducts !== null) {
                o.OrderProducts.forEach(async (op: OrderProduct) => {
                    await conn.query(sqlInsertOrderProduct, [op.quantity, op.productid, order.id])
                });
            }

            conn.release()
            return order
        } catch (err) {
            throw new Error(`Could not add new user ${o.userid}, ${o.status} Error${err}`)
        }
    }

}