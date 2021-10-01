import express, { Request, Response } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { Order, OrderStore } from '../models/order'
import jwt from 'jsonwebtoken';
import verifyAuthToken from './verify';

const TOKEN_SECRET = process.env.TOKEN_SECRET || '';

const orderStore = new OrderStore()

const ordersForUsers = async (req: Request, res: Response) => {
    const intId = parseInt((req.query.id || '1').toString())
    const orders = await orderStore.ordersForUser(intId)
    res.json(orders)
}
const create = async (req: Request, res: Response) => {
    const order: Order = {
        id: 0,
        userid: req.body.userid,
        status: req.body.status,
        OrderProducts: req.body.OrderProducts
    }
    // try {
    //     jwt.verify(req.body.token, TOKEN_SECRET)
    // } catch (err) {
    //     res.status(401)
    //     res.json(`Invalid token ${err}`)
    //     return
    // }

    try {
        const newOrder = await orderStore.create(order)
        res.json(newOrder)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const order_routes = (app: express.Application) => {
    app.get('/users/:id/orders', verifyAuthToken, ordersForUsers)
    // add product
    app.post('/orders/:id/products', verifyAuthToken, create)
}

export default order_routes