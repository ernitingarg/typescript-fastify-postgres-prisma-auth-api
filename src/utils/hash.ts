import * as bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);

  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}
