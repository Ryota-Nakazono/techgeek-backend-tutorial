import { createOrder } from "../api/order/index.js";

export async function orderRouter(app) {
  // 注文情報を登録するAPI
  app.post("/purchase/create", createOrder);
}
