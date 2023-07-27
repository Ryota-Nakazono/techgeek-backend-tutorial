import pg from "pg";

export const TechGeekDB = {
  connect: async () => {
    const client = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    });
    await client.connect();
    return client;
  },
  init: async () => {
    const client = await TechGeekDB.connect();
    const hasUsersTable = await client.query(
      `SELECT EXISTS (
        SELECT 1
        FROM   information_schema.tables
        WHERE  table_schema = 'public'
        AND    table_name = 'users'
      );`
    );
    if (!hasUsersTable.rows[0].exists) {
      console.log("Creating users table");
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
    const hasProductsTable = await client.query(
      `SELECT EXISTS (
        SELECT 1
        FROM   information_schema.tables
        WHERE  table_schema = 'public'
        AND    table_name = 'products'
      );`
    );
    if (!hasProductsTable.rows[0].exists) {
      console.log("Creating products table");
      await client.query(`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description text,
          price INTEGER NOT NULL,
          image_path VARCHAR(255),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
    const hasPurchaseTable = await client.query(
      `SELECT EXISTS (
        SELECT 1
        FROM   information_schema.tables
        WHERE  table_schema = 'public'
        AND    table_name = 'purchases'
      );`
    );
    if (!hasPurchaseTable.rows[0].exists) {
      console.log("Creating purchases table");
      await client.query(`
        CREATE TABLE purchases (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users (id),
          amount INTEGER NOT NULL,
          product_ids INTEGER[] NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
  },
  createUser: async (name, email, password) => {
    const client = await TechGeekDB.connect();
    const result = await client.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
      [name, email, password]
    );
    return result.rows[0];
  },
  getUser: async (email) => {
    const client = await TechGeekDB.connect();
    const result = await client.query(`SELECT * FROM users WHERE email = $1;`, [email]);
    return result.rows[0];
  },
  getUserById: async (id) => {
    const client = await TechGeekDB.connect();
    const result = await client.query(`SELECT * FROM users WHERE id = $1;`, [id]);
    return result.rows[0];
  },
  createProduct: async (title, description, price, image_path) => {
    const client = await TechGeekDB.connect();
    const result = await client.query(
      `INSERT INTO products (title, description, price, image_path) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [title, description, price, image_path]
    );
    return result.rows[0];
  },
  getProductById: async (id) => {
    const client = await TechGeekDB.connect();
    const result = await client.query(`SELECT * FROM products WHERE id = $1;`, [id]);
    return result.rows[0];
  },
  createPurchase: async (user_id, amount, product_ids) => {
    const client = await TechGeekDB.connect();
    const result = await client.query(
      `INSERT INTO purchases (user_id, amount, product_ids) VALUES ($1, $2, $3) RETURNING *;`,
      [user_id, amount, product_ids]
    );
    return result.rows[0];
  },
  getPurchase: async (user_id) => {
    const client = await TechGeekDB.connect();
    const result = await client.query(`SELECT * FROM purchases WHERE user_id = $1;`, [
      user_id,
    ]);
    return result.rows[0];
  },
};
