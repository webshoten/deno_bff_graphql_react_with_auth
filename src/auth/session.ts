/**
 * セッション管理
 *
 * JWT の生成と Cookie 文字列の作成を担当
 */

import { createJwt, getJwtExpirationMs, verifyJwt } from "./jwt.ts";
import { getKv } from "../kv/index.ts";
import { type AuthUser, getAuthUserRepository } from "../kv/auth-users.ts";

export const AUTH_COOKIE_NAME = "auth_token";

/**
 * 認証 Cookie 文字列を生成
 */
export async function createAuthCookie(user: {
  id: string;
  email: string;
}): Promise<string> {
  const jwt = await createJwt({ userId: user.id, email: user.email });
  const maxAge = Math.floor(getJwtExpirationMs() / 1000);

  return `${AUTH_COOKIE_NAME}=${jwt}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}`;
}

/**
 * 認証 Cookie 削除用の文字列を生成
 */
export function createLogoutCookie(): string {
  return `${AUTH_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`;
}

/**
 * Cookie からユーザーを復元
 */
export async function getUserFromCookie(
  cookieHeader: string | null,
): Promise<AuthUser | null> {
  if (!cookieHeader) {
    return null;
  }

  // Cookie ヘッダーから auth_token を抽出
  const cookies = parseCookies(cookieHeader);
  const token = cookies[AUTH_COOKIE_NAME];

  if (!token) {
    return null;
  }

  // JWT を検証
  const payload = await verifyJwt(token);
  if (!payload) {
    return null;
  }

  // ユーザーを取得
  const kv = await getKv();
  const authUserRepo = getAuthUserRepository(kv);
  return await authUserRepo.getById(payload.userId);
}

/**
 * Cookie ヘッダーをパース
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  for (const cookie of cookieHeader.split(";")) {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (name) {
      cookies[name] = valueParts.join("=");
    }
  }

  return cookies;
}

/**
 * GraphQL レスポンスから認証成功を検出して Cookie 文字列を生成
 */
export async function handleAuthResponse(responseBody: string): Promise<{
  authCookie: string | null;
  debugLog: string | null;
}> {
  let parsedBody: {
    data?: {
      login?: { success: boolean; user?: { id: string; email: string } };
      signup?: { success: boolean; user?: { id: string; email: string } };
    };
  } | null = null;

  try {
    parsedBody = JSON.parse(responseBody);
  } catch {
    return { authCookie: null, debugLog: null };
  }

  // login 成功時のみ Cookie をセット
  // （signup 時はメール認証が必要なので Cookie をセットしない）
  if (parsedBody?.data?.login?.success && parsedBody.data.login.user) {
    const user = parsedBody.data.login.user;
    const cookie = await createAuthCookie(user);
    return {
      authCookie: cookie,
      debugLog: `🔐 Login成功、Cookieをセット: ${JSON.stringify(user)}`,
    };
  }

  return { authCookie: null, debugLog: null };
}
