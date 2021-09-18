import { Order, OrderStore } from '../order'

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

});