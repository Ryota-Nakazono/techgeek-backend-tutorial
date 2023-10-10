import { TechGeekDB } from "../../techgeek-db.js";
import jwt from "jsonwebtoken";
import { verifyPassword } from "../../utils/passwordUtils.js";

export async function login(req, res) {
  const { email, password } = req.body;
  console.log({ email, password });
  const user = await TechGeekDB.getUserByEmail(email);
  console.log({ user });
  if (!user) {
    return res.status(401).send("ユーザーが見つかりません");
  }
  if (user.error) {
    return res.status(500).send(user.error);
  }
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    return res.status(401).send("パスワードが間違っています");
  }
  delete user.password;
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
  return res.status(200).send(token);
}
