import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import jwt from 'jsonwebtoken';
import verifyAuthToken from './verify';

const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
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
    const product: Product = {
        id: 0,
        name: req.body.name,
        price: req.body.price
    }
    try {
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
    app.post('/products', verifyAuthToken, create)
}

export default product_routes