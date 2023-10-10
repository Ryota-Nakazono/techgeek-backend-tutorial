import { TechGeekDB } from "../../techgeek-db.js";
import bcrypt from "bcryptjs";
import { verifyPassword } from "../../utils/passwordUtils.js";

export async function updateUserPassword(req, res) {
  const { email, password, newPassword } = req.body;
  console.log({ email, password, newPassword });
  const user = await TechGeekDB.getUserByEmail(email);
  console.log({ user });
  if (!user) {
    return res.status(401).send("ユーザーが見つかりません");
  }
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    return res.status(401).send("現在のパスワードが間違っています");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await TechGeekDB.updateUser(
    user.id,
    user.name,
    user.email,
    hashedPassword
  );
  console.log(updatedUser);
  if (updatedUser.error) {
    if (updatedUser.error === "ユーザーが見つかりません") {
      return res.status(404).send(updatedUser.error);
    } else {
      return res.status(500).send(updatedUser.error);
    }
  }
  return res.status(200).send(updatedUser);
}
