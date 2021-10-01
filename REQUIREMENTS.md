# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index: '/products' ->[GET]
- Show (args:product id): '/products/:id' -> [GET]
- Create (args:Product) [token required] '/product' ->[POST]


#### Users
- Index [token required]: '/users' ->[GET]
- Show (args:id) [token required] '/users/:id' ->[GET]
- Create (args:User)[token required] '/users' ->[POST]

#### Orders
- Current Order by user (args: user id)[token required]: '/users/:id/orders' ->[GET]


## Data Shapes
#### Products
-  id:varchar[serial primary key]
- name:varchar
- price:integer


#### Users
- id:varchar[serial primary key]
- firstName:varchar
- lastName:varchar
- password:string

#### Orders
- id:varchar[serial primary key]
- user_id:string[foreign key to users table]
- status of order (active or complete):string

#### Order_Products
- orderid:int -references orders(id)
- quantity of each product in the order: integer
- productid :int- references products(id)

Database Schema

ORDER_PRODUCTS TABLE
  Table "public.order_products"
  Column   |  Type   | Collation | Nullable | Default 
-----------+---------+-----------+----------+---------
 orderid   | integer |           | not null | 
 productid | integer |           | not null | 
 quantity  | integer |           | not null | 
Foreign-key constraints:
    "order_products_orderid_fkey" FOREIGN KEY (orderid) REFERENCES orders(id)
    "order_products_productid_fkey" FOREIGN KEY (productid) REFERENCES products(id)

ORDERS TABLE
  Table "public.orders"
 Column |       Type        | Collation | Nullable |              Default               
--------+-------------------+-----------+----------+------------------------------------
 id     | integer           |           | not null | nextval('orders_id_seq'::regclass)
 userid | integer           |           |          | 
 status | character varying |           |          | 
Indexes:
    "orders_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "orders_userid_fkey" FOREIGN KEY (userid) REFERENCES users(id)
Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_orderid_fkey" FOREIGN KEY (orderid) REFERENCES orders(id)

PRODUCTS TABLE
  Table "public.products"
 Column |       Type        | Collation | Nullable |               Default                
--------+-------------------+-----------+----------+--------------------------------------
 id     | integer           |           | not null | nextval('products_id_seq'::regclass)
 name   | character varying |           |          | 
 price  | numeric           |           |          | 
Indexes:
    "products_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_productid_fkey" FOREIGN KEY (productid) REFERENCES products(id)
 
 USERS TABLE
 Table "public.users"
  Column   |       Type        | Collation | Nullable |              Default              
-----------+-------------------+-----------+----------+-----------------------------------
 id        | integer           |           | not null | nextval('users_id_seq'::regclass)
 firstname | character varying |           |          | 
 lastname  | character varying |           |          | 
 email     | character varying |           |          | 
 password  | character varying |           |          | 
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)
Referenced by:
    TABLE "orders" CONSTRAINT "orders_userid_fkey" FOREIGN KEY (userid) REFERENCES users(id)
