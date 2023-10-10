import { TechGeekDB } from "../../techgeek-db.js";
import bcrypt from "bcryptjs";

export async function updateUser(req, res) {
  const { id, name, email, password } = req.body;
  console.log({ id, name, email, password });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await TechGeekDB.updateUser(id, name, email, hashedPassword);
  console.log(user);
  if (user.error) {
    if (user.error === "ユーザーが見つかりません") {
      return res.status(404).send(user.error);
    } else {
      return res.status(500).send(user.error);
    }
  } else {
    return res.status(200).send(user);
  }
}
