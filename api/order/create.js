import { TechGeekDB } from "../../techgeek-db.js";

export async function createOrder(req, res) {
  const { user_id, amount, product_ids } = req.body;
  console.log({ user_id, product_ids });
  const purchase = await TechGeekDB.createPurchase(user_id, amount, product_ids);
  console.log(purchase);
  if (purchase.error) {
    return res.status(500).send(purchase.error);
  } else {
    return res.status(200).send(purchase);
  }
}
