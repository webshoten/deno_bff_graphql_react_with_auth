/**
 * Firebase ID トークン検証
 *
 * jose ライブラリを使用して Firebase ID トークンを検証
 */

import { createRemoteJWKSet, jwtVerify } from "jose";

// Firebase/Google の JWKS エンドポイント
const JWKS_URL = new URL(
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
);

// Firebase プロジェクト ID
const FIREBASE_PROJECT_ID = Deno.env.get("FIREBASE_PROJECT_ID") || "";

// JWKS を取得（キャッシュ付き）
const jwks = createRemoteJWKSet(JWKS_URL);

// デコードされたトークンの型
export type DecodedToken = {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
};

/**
 * Firebase ID トークンを検証
 */
export async function verifyFirebaseToken(
  token: string,
): Promise<DecodedToken | null> {
  try {
    // トークンを検証
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });

    return {
      uid: payload.sub || "",
      email: payload.email as string | undefined,
      email_verified: payload.email_verified as boolean | undefined,
      name: payload.name as string | undefined,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Authorization ヘッダーからトークンを抽出して検証
 */
export async function verifyAuthHeader(
  authHeader: string | null,
): Promise<DecodedToken | null> {
  if (!authHeader) {
    return null;
  }

  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return null;
  }

  return await verifyFirebaseToken(match[1]);
}
