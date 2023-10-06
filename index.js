import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { TechGeekDB } from "./techgeek-db.js";
TechGeekDB.init();
import bcrypt from "bcryptjs";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello World!!</h1>");
});

/**
 * ユーザー情報のAPI
 */
app.post("/user/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log({ name, email, password });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await TechGeekDB.createUser(name, email, hashedPassword);
  console.log(user);
  if (user.error) {
    return res.status(500).send(user.error);
  } else {
    return res.status(200).send(user);
  }
});

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log({ email, password });
//   const user = await TechGeekDB.getUserByEmail(email);
//   console.log({ user });
//   if (!user) {
//     return res.status(401).send("ユーザーが見つかりません");
//   }
//   if (user.error) {
//     return res.status(500).send(user.error);
//   }
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(401).send("パスワードが間違っています");
//   }
//   // TODO: パスワードの検証や、JWTの発行などを行う
//   return res.status(200).send(user);
// });

const verifyPassword = async (password, hashedPassword) => {
  const salt = bcrypt.getSalt(hashedPassword);
  const hash = await bcrypt.hash(password, salt);
  return hashedPassword === hash;
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  const user = await TechGeekDB.getUserByEmail(email);
  console.log({ user });
  if (!user) {
    return res.status(401).send("ユーザーが見つかりません");
  }
  if (user.error) {
    return res.status(500).send(user.error);
  }
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    return res.status(401).send("パスワードが間違っています");
  }
  return res.status(200).send(user);
});

app.get("/users", async (req, res) => {
  const users = await TechGeekDB.getUsers();
  if (users.error) {
    return res.status(500).send(users.error);
  } else {
    return res.status(200).send(users);
  }
});

app.put("/users/update", async (req, res) => {
  const { id, name, email, password } = req.body;
  console.log({ id, name, email, password });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await TechGeekDB.updateUser(id, name, email, hashedPassword);
  console.log(user);
  if (user.error) {
    if (user.error === "ユーザーが見つかりません") {
      return res.status(404).send(user.error);
    } else {
      return res.status(500).send(user.error);
    }
  } else {
    return res.status(200).send(user);
  }
});

// パスワードを変更するAPI
app.post("/users/update/password", async (req, res) => {
  const { email, password, newPassword } = req.body;
  console.log({ email, password, newPassword });
  const user = await TechGeekDB.getUserByEmail(email);
  console.log({ user });
  if (!user) {
    return res.status(401).send("ユーザーが見つかりません");
  }
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    return res.status(401).send("現在のパスワードが間違っています");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await TechGeekDB.updateUser(
    user.id,
    user.name,
    user.email,
    hashedPassword
  );
  console.log(updatedUser);
  if (updatedUser.error) {
    if (updatedUser.error === "ユーザーが見つかりません") {
      return res.status(404).send(updatedUser.error);
    } else {
      return res.status(500).send(updatedUser.error);
    }
  }
  return res.status(200).send(updatedUser);
});

app.delete("/users/delete", async (req, res) => {
  const { id } = req.body;
  console.log({ id });
  const user = await TechGeekDB.deleteUser(id);
  console.log(user);
  if (user.error) {
    if (user.error === "ユーザーが見つかりません") {
      return res.status(404).send(user.error);
    } else {
      return res.status(500).send(user.error);
    }
  } else {
    return res.status(200).send({ message: "ユーザーを削除しました" });
  }
});

/**
 * 商品情報のAPI
 */
app.post("/product/create", async (req, res) => {
  const { title, description, price, image_path } = req.body;
  console.log({ title, description, price, image_path });
  const product = await TechGeekDB.createProduct(title, description, price, image_path);
  console.log(product);
  if (product.error) {
    return res.status(500).send(product.error);
  } else {
    return res.status(200).send(product);
  }
});

app.get("/products", async (req, res) => {
  const products = await TechGeekDB.getProducts();
  if (products.error) {
    return res.status(500).send(products.error);
  } else {
    return res.status(200).send(products);
  }
});

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const product = await TechGeekDB.getProduct(id);
  console.log({ product });
  if (product.error) {
    if (product.error === "商品が見つかりません") {
      return res.status(404).send(product.error);
    } else {
      return res.status(500).send(product.error);
    }
  }
  return res.status(200).send(product);
});

app.put("/product/update", async (req, res) => {
  const { id, title, description, price, image_path } = req.body;
  const product = await TechGeekDB.updateProduct(
    id,
    title,
    description,
    price,
    image_path
  );
  console.log(product);
  if (product.error) {
    if (product.error === "商品が見つかりません") {
      return res.status(404).send(product.error);
    } else {
      return res.status(500).send(product.error);
    }
  } else {
    return res.status(200).send(product);
  }
});

app.delete("/product/delete", async (req, res) => {
  const { id } = req.body;
  console.log({ id });
  if (!id) {
    return res.status(400).send("不正なリクエストデータ");
  }
  const product = await TechGeekDB.deleteProduct(id);
  console.log(product);
  if (product.error) {
    if (product.error === "商品が見つかりません") {
      return res.status(404).send(product.error);
    } else {
      return res.status(500).send(product.error);
    }
  } else {
    return res.status(200).send({ message: "商品を削除しました" });
  }
});

/**
 * 注文情報のAPI
 */
app.post("/purchase/create", async (req, res) => {
  const { user_id, amount, product_ids } = req.body;
  console.log({ user_id, product_ids });
  const purchase = await TechGeekDB.createPurchase(user_id, amount, product_ids);
  console.log(purchase);
  if (purchase.error) {
    return res.status(500).send(purchase.error);
  } else {
    return res.status(200).send(purchase);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
