import { TechGeekDB } from "../../techgeek-db.js";

export async function deleteUser(req, res) {
  const { id } = req.body;
  console.log({ id });
  const user = await TechGeekDB.deleteUser(id);
  console.log(user);
  if (user.error) {
    if (user.error === "ユーザーが見つかりません") {
      return res.status(404).send(user.error);
    } else {
      return res.status(500).send(user.error);
    }
  } else {
    return res.status(200).send({ message: "ユーザーを削除しました" });
  }
}
