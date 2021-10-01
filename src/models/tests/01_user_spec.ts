
import { User, UserStore } from '../user'
import supertest from 'supertest';
import app from '../../server'
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
const request = supertest(app)
const store = new UserStore()

let token = ''
describe("01 User Model", () => {

    it('should have an idex method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('create should add a user- check if there user is in database', async () => {
        const result = await store.create({
            id: 1,
            firstname: "test-user-bob",
            lastname: "Jones",
            email: "bob@123.com",
            password: "password"
        });
        expect(result.email).toEqual("bob@123.com");
        token = jwt.sign({
            user: {
                email: "bob@123.com",
                password: "password"
            }
        }, TOKEN_SECRET);
    });
    it('the show method should return the correct user', async () => {
        const result = await store.show(1);
        expect(result.id).toEqual(1);
    });

    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result).toBeTruthy()
    });

    it('gets the api endpoint /users', async (done) => {
        const response = await request.get('/users').set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);

        done();
    });
    it('gets the api endpoint /users/:id', async (done) => {
        const response = await request.get('/users/:id').set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        done();
    });
    it('gets the api endpoint /users for the create method', async (done) => {
        const response = await request
            .post('/users')
            .send({
                id: 0,
                firstname: "test-user",
                lastname: "Jones",
                email: "123@AudioListene!.com",
                password: "password"
            });
        expect(response.status).toBe(200);
        done();
    });

});

