import { Order, OrderProduct, OrderStore } from '../order'
import supertest from 'supertest';
import app from '../../server'
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
const request = supertest(app)
const orderStore = new OrderStore()

let token = ''

beforeAll((done) => {

    token = jwt.sign({
        user: {
            email: "bob@123.com",
            password: "password"
        }
    }, TOKEN_SECRET);
    done();
});

describe("03 Order Model", () => {

    it('should have a create method', () => {
        expect(orderStore.create).toBeDefined();
    });
    it('create should add a an order', async () => {
        const op1: OrderProduct = { quantity: 5, productid: 1 }
        const op2: OrderProduct = { quantity: 3, productid: 2 }
        const orderProducts: OrderProduct[] = [op1, op2]
        const result = await orderStore.create({
            id: 1,
            userid: 1,
            status: "active",
            OrderProducts: orderProducts
        });
        expect(result).toEqual({
            id: 1,
            userid: 1,
            status: "active"
        });
    });

    it('should have a show method', () => {
        expect(orderStore.ordersForUser).toBeDefined();
    });
    it('the show method should display userId', async () => {
        const result = await orderStore.ordersForUser(1);
        expect(result).toEqual([{
            id: 1,
            userid: 1,
            status: 'active'
        }]);
    });

    it('gets the api endpoint /users/1/orders', async (done) => {
        const response = await request
            .get('/users/1/orders')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json')
        done();
    });

});

