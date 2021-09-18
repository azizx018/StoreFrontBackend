CREATE TABLE orders(id SERIAL PRIMARY KEY, productid int REFERENCES products(id),quantity integer, userid int REFERENCES users(id), status VARCHAR);


