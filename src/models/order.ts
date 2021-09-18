import Client from "../database";

export type Order = {
    id: Number;
    productid: number,
    quantity: number,
    userid: number,
    status: string

}

export class OrderStore {
    async ordersForUser(userid: number): Promise<Order[]> {
        try {
            const sql = 'SELECT * FROM orders WHERE status=\'active\' AND userId = $1'
            const conn = await Client.connect()
            const result = await conn.query(sql, [userid])
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Could not find current user ${userid}. Error ${err}`)
        }
    }
    async create(o: Order): Promise<Order> {
        try {
            const sql = 'INSERT INTO orders (productId, quantity, userId, status) VALUES($1, $2, $3, $4) RETURNING *'
            const conn = await Client.connect()
            const result = await conn.query(sql, [o.productid, o.quantity, o.userid, o.status])
            const user = result.rows[0]
            conn.release()
            return user
        } catch (err) {
            throw new Error(`Could not add new user ${o.productid}, ${o.quantity}. ${o.userid}, ${o.status} Error${err}`)
        }
    }
}