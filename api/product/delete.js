import { TechGeekDB } from "../../techgeek-db.js";

export async function deleteProduct(req, res) {
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
}
