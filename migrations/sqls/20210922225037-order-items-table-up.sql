/* Replace with your SQL commands */
CREATE TABLE order_items(
    orderId int REFERENCES orders(id)
    ,productId int REFERENCES products(id)
    ,quantity int NOT NULL);