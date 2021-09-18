
import { User, UserStore } from '../user'
import supertest from 'supertest';
import app from '../../server'

const request = supertest(app)
const store = new UserStore()


describe("01 User Model", () => {
    it('gets the api endpoint /users', async (done) => {
        const response = await request.get('/users');
        expect(response.status).toBe(200);
        done();
    })
    it('should have an idex method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('create should add a user', async () => {
        const result = await store.create({
            id: 1,
            firstname: "test-user",
            lastname: "Jones",
            email: "123@AudioListener.com",
            password: "password"
        });
        expect(result).toEqual({
            id: 1,
            firstname: "test-user",
            lastname: "Jones",
            email: "123@AudioListener.com",
            password: "password"
        });
    });
    it('the show method should return the correct user', async () => {
        const result = await store.show(1);
        expect(result).toEqual({
            id: 1,
            firstname: "test-user",
            lastname: "Jones",
            email: "123@AudioListener.com",
            password: "password"
        });
    });

    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result).toEqual([{
            id: 1,
            firstname: "test-user",
            lastname: "Jones",
            email: "123@AudioListener.com",
            password: "password"
        }]);
    });
});