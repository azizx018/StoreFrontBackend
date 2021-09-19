import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'

const productStore = new ProductStore()

const index = async (req: Request, res: Response) => {
    const products = await productStore.index()
    res.json(products)
}
const show = async (req: Request, res: Response) => {
    const products = await productStore.show(req.body.id)
    res.json(products)
}
const create = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price
        }
        const newProduct = await productStore.create(product)
        res.json(newProduct)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const product_routes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products', create)
}

export default product_routes