import Client from "../database";
import bcrypt from 'bcrypt';


const { BCRYPT_PASSWORD } = process.env;
const SALT_ROUNDS = process.env.SALT_ROUNDS || '';

export type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string

}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM users'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get users. Error. ${err}`)
        }
    }

    async show(id: number): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=$1'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`)
        }
    }

    async create(u: User): Promise<User> {
        try {
            const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING *'
            const conn = await Client.connect()
            const hash = bcrypt.hashSync(u.password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS));

            const result = await conn.query(sql, [u.firstname, u.lastname, u.email, hash])
            const user = result.rows[0]
            conn.release()
            return user
        } catch (err) {
            throw new Error(`Could not add new user ${u.firstname}, ${u.lastname}. Error${err}`)
        }
    }

    async authenticate(email: string, password: string): Promise<User | null> {
        const conn = await Client.connect()
        const sql = 'SELECT password FROM users WHERE email=$1'
        const result = await conn.query(sql, [email])
        console.log(password + BCRYPT_PASSWORD)

        if (result.rows.length) {
            const user = result.rows[0]
            console.log(user)

            if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
                return user
            }
        }
        return null
    }
}