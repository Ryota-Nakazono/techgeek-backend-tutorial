import jwt from "jsonwebtoken";

export async function userAuhentication(req, res, next) {
  const { token } = req.body;
  if (!token) {
    return res.status(401).send("トークンがありません");
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log({ user });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}
