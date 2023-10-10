import { TechGeekDB } from "../../techgeek-db.js";

export async function product(req, res) {
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
}
