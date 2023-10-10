import { TechGeekDB } from "../../techgeek-db.js";

export async function products(req, res) {
  const products = await TechGeekDB.getProducts();
  if (products.error) {
    return res.status(500).send(products.error);
  } else {
    return res.status(200).send(products);
  }
}
