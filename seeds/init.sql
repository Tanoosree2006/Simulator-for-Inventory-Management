CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  stock INTEGER NOT NULL CHECK (stock >= 0),
  version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  quantity_ordered INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products(name, stock) VALUES ('Super Widget', 100);
INSERT INTO products(name, stock) VALUES ('Mega Gadget', 50);