import {
  createProduct,
  deleteProduct,
  product,
  products,
  updateProduct,
} from "../api/product/index.js";
import { userAuhentication } from "../middleware/index.js";

export function productRouter(app) {
  // 商品を登録するAPI
  app.post("/product/create", userAuhentication, createProduct);

  // 商品の一覧を取得するAPI
  app.get("/products", products);

  // 商品の情報を取得するAPI
  app.get("/product/:id", product);

  // 商品の情報を更新するAPI
  app.put("/product/update", updateProduct);

  // 商品を削除するAPI
  app.delete("/product/delete", deleteProduct);
}
