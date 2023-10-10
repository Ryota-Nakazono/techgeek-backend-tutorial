import {
  account,
  deleteUser,
  getUsers,
  login,
  register,
  updateUser,
  updateUserPassword,
} from "../api/user/index.js";
import { userAuhentication } from "../middleware/user-authentication.js";

export function userRouter(app) {
  // ユーザー登録API
  app.post("/user/register", register);

  // ログインAPI
  app.post("/login", login);

  // ユーザーの一覧を取得するAPI
  app.get("/users", getUsers);

  // ユーザーの情報を取得するAPI
  app.get("/user/account", userAuhentication, account);

  // ユーザーの情報を更新するAPI
  app.put("/users/update", updateUser);

  // パスワードを変更するAPI
  app.post("/users/update/password", updateUserPassword);

  // ユーザーを削除するAPI
  app.delete("/users/delete", deleteUser);
}
