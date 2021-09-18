import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'

const userStore = new UserStore()

const index = async (req: Request, res: Response) => {
    const users = await userStore.index()
    res.json(users)
}
const show = async (req: Request, res: Response) => {
    const users = await userStore.show(req.body.id)
    res.json(users)
}
const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        }
        const newUser = await userStore.create(user)
        res.json(newUser)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const user_routes = (app: express.Application) => {
    app.get('/users', index)
    app.get('/users/:id', show)
    app.post('/users', create)
}


export default user_routes