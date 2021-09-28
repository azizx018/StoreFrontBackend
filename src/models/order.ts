import Client from "../database";
import verifyAuthToken from "../handlers/verify";

export type Order = {
    id: number,
    userid: number,
    status: string,
    OrderProducts?: OrderProduct[] | null
}
export type OrderProduct = {
    productid: number,
    quantity: number,
    ProductName?: string | null
}

export class OrderStore {
    async ordersForUser(userid: number): Promise<Order[]> {
        try {
            const conn = await Client.connect()

            const sqlOrdersForUser = 'SELECT ' +
                'O.id AS OrderId, P.name AS Product, OP.quantity ' +
                'FROM Orders O ' +
                'JOIN Order_products OP ON OP.OrderId = O.id ' +
                'JOIN Products P ON P.id = OP.ProductId ' +
                'WHERE O.userId = $1 AND O.status = \'active\''
            const ordersForUser = await conn.query(sqlOrdersForUser, [userid])

            const orders: Order[] = []
            const rows = ordersForUser.rows
            rows.forEach((orderProductQuantity: { orderid: number, product: string, quantity: number }) => {
                const ordersWithSameId = orders.filter(order => order.id === orderProductQuantity.orderid)
                const orderExists = ordersWithSameId.length > 0

                if (!orderExists) {

                    const newOrder: Order = {
                        id: orderProductQuantity.orderid,
                        userid: userid,
                        status: 'active',
                        OrderProducts: []
                    }


                    rows.forEach((oPQ: { orderid: number, product: string, quantity: number }) => {
                        if (newOrder.id === oPQ.orderid) {
                            const orderProduct: OrderProduct = {
                                productid: 0,
                                quantity: oPQ.quantity,
                                ProductName: oPQ.product
                            }

                            newOrder.OrderProducts?.push(orderProduct)
                        }
                    });
                    orders.push(newOrder)
                }

            });

            // loop again through rows, and add in the OrderProducts that have the same orderid
            //newOrder.OrderProducts?.push(yourNewOrderProduct)




            //const sql = 'SELECT * FROM orders WHERE status=\'active\' AND userId = $1'
            //const result = await conn.query(sql, [userid])
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