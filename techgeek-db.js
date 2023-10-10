import pg from "pg";

const deletePurchasesOfUser = async (client, userId) => {
  await client.query(`DELETE FROM purchases WHERE user_id = $1;`, [userId]);
};

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
    try {
      const client = await TechGeekDB.connect();
      const user = await TechGeekDB.getUserByEmail(email);
      if (user) {
        return { error: "このメールアドレスは登録されています" };
      } else {
        const result = await client.query(
          `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
          [name, email, password]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  getUsers: async () => {
    try {
      const client = await TechGeekDB.connect();
      const result = await client.query(`SELECT * FROM users;`);
      return result.rows;
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  getUserByEmail: async (email) => {
    try {
      const client = await TechGeekDB.connect();
      const result = await client.query(`SELECT * FROM users WHERE email = $1;`, [email]);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  getUserById: async (id) => {
    try {
      const client = await TechGeekDB.connect();
      const result = await client.query(`SELECT * FROM users WHERE id = $1;`, [id]);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  updateUser: async (id, name, email, password) => {
    try {
      const client = await TechGeekDB.connect();
      const user = await TechGeekDB.getUserById(id);
      console.log("更新前のユーザー情報：", user);
      if (!user) {
        return { error: "ユーザーが見つかりません" };
      } else {
        const result = await client.query(
          `UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *;`,
          [name, email, password, id]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  deleteUser: async (id) => {
    try {
      const client = await TechGeekDB.connect();
      const user = await TechGeekDB.getUserById(id);
      console.log("削除前のユーザー情報：", user);
      if (!user) {
        return { error: "ユーザーが見つかりません" };
      } else {
        await deletePurchasesOfUser(client, id);
        const result = await client.query(
          `DELETE FROM users WHERE id = $1 RETURNING *;`,
          [id]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  createProduct: async (title, description, price, image_path) => {
    try {
      const client = await TechGeekDB.connect();
      const result = await client.query(
        `INSERT INTO products (title, description, price, image_path) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [title, description, price, image_path]
      );
      return result.rows[0];
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  getProducts: async () => {
    try {
      const client = await TechGeekDB.connect();
      const result = await client.query(`SELECT * FROM products;`);
      return result.rows;
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  getProduct: async (id) => {
    try {
      const client = await TechGeekDB.connect();
      const result = await client.query(`SELECT * FROM products WHERE id = $1;`, [id]);
      return result.rows[0] || { error: "商品が見つかりません" };
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  updateProduct: async (id, title, description, price, image_path) => {
    try {
      const client = await TechGeekDB.connect();
      const product = await TechGeekDB.getProduct(id);
      console.log("更新前の商品情報：", product);
      if (product.error) {
        return product;
      } else {
        const result = await client.query(
          `UPDATE products SET title = $1, description = $2, price = $3, image_path = $4 WHERE id = $5 RETURNING *;`,
          [title, description, price, image_path, id]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  deleteProduct: async (id) => {
    try {
      const client = await TechGeekDB.connect();
      const product = await TechGeekDB.getProduct(id);
      console.log("削除前の商品情報：", product);
      if (product.error) {
        return product;
      } else {
        const result = await client.query(
          `DELETE FROM products WHERE id = $1 RETURNING *;`,
          [id]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  createPurchase: async (user_id, amount, product_ids) => {
    try {
      const client = await TechGeekDB.connect();
      for (let id of product_ids) {
        const product = await TechGeekDB.getProduct(id);
        if (product.error) {
          return { error: `商品ID ${id} は存在しません` };
        }
      }
      const result = await client.query(
        `INSERT INTO purchases (user_id, amount, product_ids) VALUES ($1, $2, $3) RETURNING *;`,
        [user_id, amount, product_ids]
      );
      return result.rows[0];
    } catch (error) {
      console.log(error);
      return { error: "不明なエラーが発生しました" };
    }
  },
  getPurchase: async (user_id) => {
    const client = await TechGeekDB.connect();
    const result = await client.query(`SELECT * FROM purchases WHERE user_id = $1;`, [
      user_id,
    ]);
    return result.rows[0];
  },
};
