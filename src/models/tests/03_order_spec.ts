import { Order, OrderStore } from '../order'
import supertest from 'supertest';
import app from '../../server'

const request = supertest(app)
const orderStore = new OrderStore()

describe("03 Order Model", () => {

    it('should have a create method', () => {
        expect(orderStore.create).toBeDefined();
    });
    it('create should add a an order', async () => {
        const result = await orderStore.create({
            id: 1,
            productid: 1,
            quantity: 6,
            userid: 1,
            status: "active"
        });
        expect(result).toEqual({
            id: 1,
            productid: 1,
            quantity: 6,
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
            productid: 1,
            quantity: 6,
            userid: 1,
            status: 'active'
        }]);
    });
    it('gets the api endpoint /orders', async (done) => {
        const response = await request.get('/users');
        expect(response.status).toBe(200);
        done();
    });
    it('gets the api endpoint /users/:id', async (done) => {
        const response = await request.get('/users/:id');
        expect(response.status).toBe(200);
        done();
    });

});

