// パスワードハッシュ・検証

import * as bcrypt from "bcrypt";

/**
 * パスワードをハッシュ化
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password);
}

/**
 * パスワードを検証
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
