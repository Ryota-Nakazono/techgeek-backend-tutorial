import { TechGeekDB } from "../../techgeek-db.js";

export async function createProduct(req, res) {
  const { title, description, price, image_path, token } = req.body;
  console.log({ title, description, price, image_path, token });
  console.log("user:", req.user);
  const product = await TechGeekDB.createProduct(title, description, price, image_path);
  console.log(product);
  if (product.error) {
    return res.status(500).send(product.error);
  } else {
    return res.status(200).send(product);
  }
}
