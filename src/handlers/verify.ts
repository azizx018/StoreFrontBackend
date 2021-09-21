import jwt from 'jsonwebtoken';
import { Request, Response } from 'express'


const TOKEN_SECRET = process.env.TOKEN_SECRET || '';

const verifyAuthToken = (req: Request, res: Response, next: () => void) => {

    try {

        const authorizationHeader = req.headers.authorization || '';
        if (authorizationHeader.length < 1) {
            throw new Error(` empty auth header`)
        }
        const token = authorizationHeader.split(' ')[1] || '';
        jwt.verify(token, TOKEN_SECRET)
        next()
    } catch (err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
}

export default verifyAuthToken