// メール認証トークンの生成・検証・削除

import { getKv } from "../kv/index.ts";

// トークンデータ型
type EmailToken = {
  userId: string;
  expiresAt: Date;
};

// トークンの有効期限（24時間）
const TOKEN_EXPIRY_HOURS = 24;

/**
 * メール認証トークンを生成してKVに保存
 */
export async function createEmailToken(userId: string): Promise<string> {
  const kv = await getKv();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  const key = ["auth_email_tokens", token];
  await kv.set(key, { userId, expiresAt });

  return token;
}

/**
 * メール認証トークンを検証
 * 有効ならuserIdを返却、無効ならnull
 */
export async function verifyEmailToken(token: string): Promise<string | null> {
  const kv = await getKv();
  const key = ["auth_email_tokens", token];
  const result = await kv.get<EmailToken>(key);

  if (!result.value) {
    return null;
  }

  // 有効期限チェック
  const expiresAt = new Date(result.value.expiresAt);
  if (expiresAt < new Date()) {
    // 期限切れの場合はトークンを削除
    await kv.delete(key);
    return null;
  }

  return result.value.userId;
}

/**
 * メール認証トークンを削除
 */
export async function deleteEmailToken(token: string): Promise<void> {
  const kv = await getKv();
  const key = ["auth_email_tokens", token];
  await kv.delete(key);
}
