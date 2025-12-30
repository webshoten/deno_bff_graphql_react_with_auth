// パスワードハッシュ・検証
// Web Crypto API を使用（Deno Deploy 対応）

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/**
 * ランダムなソルトを生成
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * PBKDF2 でハッシュを生成
 */
async function pbkdf2(
  password: string,
  salt: Uint8Array,
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );

  return new Uint8Array(derivedBits);
}

/**
 * Uint8Array を16進数文字列に変換
 */
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * 16進数文字列を Uint8Array に変換
 */
function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * パスワードをハッシュ化
 * 形式: iterations$salt$hash（すべて16進数）
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const hash = await pbkdf2(password, salt);
  return `${ITERATIONS}$${toHex(salt)}$${toHex(hash)}`;
}

/**
 * パスワードを検証
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [iterationsStr, saltHex, hashHex] = storedHash.split("$");
  const iterations = parseInt(iterationsStr, 10);
  const salt = fromHex(saltHex);
  const expectedHash = fromHex(hashHex);

  // イテレーション数が異なる場合は古いハッシュ形式
  if (iterations !== ITERATIONS) {
    console.warn("⚠️ ハッシュのイテレーション数が異なります");
  }

  const hash = await pbkdf2(password, salt);

  // タイミング攻撃対策：全バイトを比較
  if (hash.length !== expectedHash.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < hash.length; i++) {
    result |= hash[i] ^ expectedHash[i];
  }

  return result === 0;
}
