import { TechGeekDB } from "../../techgeek-db.js";
import bcrypt from "bcryptjs";

export async function register(req, res) {
  const { name, email, password } = req.body;
  console.log({ name, email, password });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await TechGeekDB.createUser(name, email, hashedPassword);
  console.log(user);
  if (user.error) {
    return res.status(500).send(user.error);
  } else {
    return res.status(200).send(user);
  }
}
