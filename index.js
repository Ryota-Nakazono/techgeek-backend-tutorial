import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { TechGeekDB } from "./techgeek-db.js";
TechGeekDB.init();

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
  const user = await TechGeekDB.createUser(name, email, password);
  console.log(user);
  if (user.error) {
    return res.status(500).send(user.error);
  } else {
    return res.status(200).send(user);
  }
});

app.post("/login", async (req, res) => {
  const { email } = req.body;
  console.log({ email });
  const user = await TechGeekDB.getUser(email);
  console.log({ user });

  // TODO: パスワードの検証や、JWTの発行などを行う

  if (user.message) {
    return res.status(200).send(user.message);
  } else if (user.error) {
    return res.status(500).send(user.error);
  } else {
    return res.status(200).send(user);
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
  if (product.message) {
    return res.status(200).send(product.message);
  } else if (product.error) {
    return res.status(500).send(product.error);
  }
  return res.status(200).send(product);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
