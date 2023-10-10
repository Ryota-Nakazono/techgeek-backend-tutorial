export async function account(req, res) {
  const user = req.user;
  delete user.iat;
  delete user.exp;
  return res.status(200).send(user);
}
