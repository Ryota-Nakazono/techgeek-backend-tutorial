import bcrypt from "bcryptjs";

// パスワードの検証
export const verifyPassword = async (password, hashedPassword) => {
  const salt = bcrypt.getSalt(hashedPassword);
  const hash = await bcrypt.hash(password, salt);
  return hashedPassword === hash;
};
