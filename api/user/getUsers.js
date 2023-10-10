import { TechGeekDB } from "../../techgeek-db.js";

export async function getUsers(req, res) {
  const users = await TechGeekDB.getUsers();
  if (users.error) {
    return res.status(500).send(users.error);
  } else {
    return res.status(200).send(users);
  }
}
