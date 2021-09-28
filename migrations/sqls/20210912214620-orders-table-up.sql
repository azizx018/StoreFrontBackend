CREATE TABLE orders(
 id SERIAL PRIMARY KEY,
 userid int REFERENCES users(id), 
 status VARCHAR);


