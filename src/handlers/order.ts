import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'

const orderStore = new OrderStore()

const ordersForUsers = async (req: Request, res: Response) => {
    const orders = await orderStore.ordersForUser(req.body.userid)
    res.json(orders)
}
const create = async (req: Request, res: Response) => {
    try {
        const order: Order = {
            id: req.body.id,
            productid: req.body.productid,
            quantity: req.body.quantity,
            userid: req.body.userid,
            status: req.body.status
        }
        const newOrder = await orderStore.create(order)
        res.json(newOrder)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const order_routes = (app: express.Application) => {
    app.get('/users/:id', ordersForUsers)
    app.post('/orders', create)
}

export default order_routes