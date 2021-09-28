/* Replace with your SQL commands */
CREATE TABLE order_products(
    orderId int NOT NULL REFERENCES orders(id)
    ,productId int NOT NULL REFERENCES products(id)
    ,quantity int NOT NULL);