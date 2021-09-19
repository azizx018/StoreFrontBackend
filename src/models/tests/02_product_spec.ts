import { Product, ProductStore } from '../product'
import supertest from 'supertest';
import app from '../../server'

const request = supertest(app)
const productStore = new ProductStore()

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
            price: 2
        });
        expect(result).toEqual({
            id: 1,
            name: "apples",
            price: 2
        })
    });
    it('the show method should return requested product id', async () => {
        const result = await productStore.show(1);
        expect(result).toEqual({
            id: 1,
            name: "apples",
            price: 2
        })
    });
    it('the index method should return a list of products', async () => {
        const result = await productStore.index();
        expect(result.length).toEqual(1)
        expect(result).toEqual([{
            id: 1,
            name: "apples",
            price: 2
        }])
    });
    it('gets the api endpoint /products', async (done) => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
        done();
    });
    it('gets the api endpoint /products/:id', async (done) => {
        const response = await request.get('/products/:id');
        expect(response.status).toBe(200);
        done();
    });
    it('gets the api endpoint /products for the create method', async (done) => {
        const response = await request.post('/products');
        expect(response.status).toBe(200);
        done();
    });
});