import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken';
import verifyAuthToken from './verify';


const TOKEN_SECRET = process.env.TOKEN_SECRET || '';

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
            id: 0,
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
const authenticate = async (req: Request, res: Response) => {
    try {
        const u = await userStore.authenticate(req.body.email, req.body.password)
        const token = jwt.sign({ user: u }, TOKEN_SECRET);
        res.json({ 'token': token })
    } catch (err) {
        res.status(401)
        res.json({ err })
    }
}




const user_routes = (app: express.Application) => {
    app.get('/users', verifyAuthToken, index)
    app.get('/users/:id', verifyAuthToken, show)
    app.post('/users', create)
    app.post('/users/authenticate', authenticate)
}



export default user_routes




