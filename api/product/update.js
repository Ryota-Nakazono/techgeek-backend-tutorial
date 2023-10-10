import { TechGeekDB } from "../../techgeek-db.js";

export async function updateProduct(req, res) {
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
}
