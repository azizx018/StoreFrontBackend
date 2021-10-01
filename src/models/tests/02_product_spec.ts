import { Product, ProductStore } from '../product'
import supertest from 'supertest';
import app from '../../server'
import jwt from 'jsonwebtoken';




const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
const request = supertest(app)
const productStore = new ProductStore()
let token = '';

beforeAll((done) => {

    token = jwt.sign({
        user: {
            email: "bob@123.com",
            password: "password"
        }
    }, TOKEN_SECRET);
    done();
});

describe("02 Product Model", () => {
    it('should have an idex method', () => {
        expect(productStore.index).toBeDefined();
    });

    it('should have a create method', () => {
        expect(productStore.create).toBeDefined();
    });
    it('create should add a product', async () => {
        const result = await productStore.create({
            id: 1,
            name: "apples",
            price: "2"
        });
        expect(result).toEqual({
            id: 1,
            name: "apples",
            price: "2"
        })
    });
    it('the show method should return requested product id', async () => {
        const result = await productStore.show(1);
        expect(result).toEqual({
            id: 1,
            name: "apples",
            price: "2"
        })
    });
    it('the index method should return a list of products', async () => {
        const result = await productStore.index();
        expect(result.length).toEqual(1)
        expect(result).toEqual([{
            id: 1,
            name: "apples",
            price: "2"
        }])

    });
    it('gets the api endpoint /products', async (done) => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
        done();
    });
    it('gets the api endpoint /products/:id', async (done) => {
        const response = await request.get('/products/1');
        expect(response.status).toBe(200);
        done();
    });
    it('gets the api endpoint /products for the create method', async (done) => {
        const response = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: 1,
                name: "banana",
                price: "2"
            });
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json')
        done();

    });
});