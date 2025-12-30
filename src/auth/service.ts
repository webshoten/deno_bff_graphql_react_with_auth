// 認証サービス（ビジネスロジック）

import { hashPassword, verifyPassword } from "./password.ts";
import type { AuthUser, CreateAuthUserInput } from "../kv/auth-users.ts";

// リポジトリのインターフェース（DI用）
export type AuthUserRepository = {
  getByEmail(email: string): Promise<AuthUser | null>;
  getById(id: string): Promise<AuthUser | null>;
  create(input: CreateAuthUserInput): Promise<AuthUser>;
  updateEmailVerified(id: string, verified: boolean): Promise<void>;
};

// サービスの依存関係
export type AuthServiceDeps = {
  authUserRepo: AuthUserRepository;
};

// サインアップの入力型
export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

// サインアップの結果型
export type SignupResult = {
  success: boolean;
  message: string;
  user: AuthUser | null;
};

// ログインの入力型
export type LoginInput = {
  email: string;
  password: string;
};

// ログインの結果型
export type LoginResult = {
  success: boolean;
  message: string;
  user: AuthUser | null;
};

// バリデーションエラー
type ValidationError = {
  field: string;
  message: string;
};

/**
 * 認証サービスを作成
 */
export function createAuthService(deps: AuthServiceDeps) {
  const { authUserRepo } = deps;

  return {
    /**
     * サインアップ入力バリデーション
     */
    validateSignupInput(input: SignupInput): ValidationError | null {
      if (!input.name || input.name.trim().length === 0) {
        return { field: "name", message: "名前を入力してください" };
      }
      if (!input.email || !input.email.includes("@")) {
        return {
          field: "email",
          message: "有効なメールアドレスを入力してください",
        };
      }
      if (!input.password || input.password.length < 8) {
        return {
          field: "password",
          message: "パスワードは8文字以上で入力してください",
        };
      }
      return null;
    },

    /**
     * ログイン入力バリデーション
     */
    validateLoginInput(input: LoginInput): ValidationError | null {
      if (!input.email || !input.email.includes("@")) {
        return {
          field: "email",
          message: "有効なメールアドレスを入力してください",
        };
      }
      if (!input.password || input.password.length === 0) {
        return {
          field: "password",
          message: "パスワードを入力してください",
        };
      }
      return null;
    },

    /**
     * サインアップ（ユーザー登録）
     */
    async signup(input: SignupInput): Promise<SignupResult> {
      // バリデーション
      const validationError = this.validateSignupInput(input);
      if (validationError) {
        return {
          success: false,
          message: validationError.message,
          user: null,
        };
      }

      // メール重複チェック
      const existingUser = await authUserRepo.getByEmail(input.email);
      if (existingUser) {
        return {
          success: false,
          message: "このメールアドレスは既に登録されています",
          user: null,
        };
      }

      // パスワードハッシュ化
      const passwordHash = await hashPassword(input.password);

      // ユーザー作成
      const user = await authUserRepo.create({
        name: input.name.trim(),
        email: input.email.toLowerCase().trim(),
        passwordHash,
      });

      return {
        success: true,
        message: "登録が完了しました",
        user,
      };
    },

    /**
     * ログイン
     */
    async login(input: LoginInput): Promise<LoginResult> {
      // バリデーション
      const validationError = this.validateLoginInput(input);
      if (validationError) {
        return {
          success: false,
          message: validationError.message,
          user: null,
        };
      }

      // ユーザー取得
      const user = await authUserRepo.getByEmail(
        input.email.toLowerCase().trim(),
      );
      if (!user) {
        return {
          success: false,
          message: "メールアドレスまたはパスワードが正しくありません",
          user: null,
        };
      }

      // パスワード照合
      const isValid = await verifyPassword(input.password, user.passwordHash);
      if (!isValid) {
        return {
          success: false,
          message: "メールアドレスまたはパスワードが正しくありません",
          user: null,
        };
      }

      return {
        success: true,
        message: "ログインしました",
        user,
      };
    },
  };
}
