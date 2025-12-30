/**
 * JWT トークン管理
 *
 * セッション管理用のJWTを生成・検証
 */

import { create, verify } from "djwt";

// JWT ペイロード型
export type JwtPayload = {
  userId: string;
  email: string;
};

// JWT 有効期限（7日間）
const JWT_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

// JWT シークレットキー（環境変数から取得、なければデフォルト）
const JWT_SECRET = Deno.env.get("JWT_SECRET") || "development-secret-key";

// CryptoKey を生成（キャッシュ）
let cryptoKey: CryptoKey | null = null;

async function getCryptoKey(): Promise<CryptoKey> {
  if (!cryptoKey) {
    const encoder = new TextEncoder();
    cryptoKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    );
  }
  return cryptoKey;
}

/**
 * JWT トークンを生成
 */
export async function createJwt(payload: JwtPayload): Promise<string> {
  const key = await getCryptoKey();

  const now = Date.now();
  const exp = Math.floor((now + JWT_EXPIRATION_MS) / 1000);

  const jwt = await create(
    { alg: "HS256", typ: "JWT" },
    {
      ...payload,
      exp,
      iat: Math.floor(now / 1000),
    },
    key,
  );

  return jwt;
}

/**
 * JWT トークンを検証してペイロードを取得
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const key = await getCryptoKey();
    const payload = await verify(token, key);

    // ペイロードの型チェック
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch {
    // 検証失敗（期限切れ、改ざん等）
    return null;
  }
}

/**
 * JWT 有効期限（ミリ秒）を取得
 */
export function getJwtExpirationMs(): number {
  return JWT_EXPIRATION_MS;
}
