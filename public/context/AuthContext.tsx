// 認証コンテキスト

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTypedMutation, useTypedQuery } from "../utils/genql-urql-bridge.ts";

// 認証ユーザー型
type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
};

// 認証コンテキスト型
type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
};

// コンテキスト作成
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider コンポーネント
type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 初期ロード中

  // me クエリ（ページロード時に認証状態を復元）
  const [meResult] = useTypedQuery({
    query: {
      me: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    },
  });

  // me クエリの結果でユーザー情報を設定
  useEffect(() => {
    if (!meResult.fetching) {
      if (meResult.data?.me) {
        setUser({
          id: meResult.data.me.id ?? "",
          name: meResult.data.me.name ?? "",
          email: meResult.data.me.email ?? "",
          emailVerified: meResult.data.me.emailVerified ?? false,
        });
      }
      setIsLoading(false);
    }
  }, [meResult.fetching, meResult.data]);

  // サインアップ mutation
  const [signupResult, executeSignup] = useTypedMutation({
    mutation: {
      signup: {
        __args: { name: "", email: "", password: "" },
        success: true,
        message: true,
        user: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
        },
      },
    },
  });

  // ログイン mutation
  const [loginResult, executeLogin] = useTypedMutation({
    mutation: {
      login: {
        __args: { email: "", password: "" },
        success: true,
        message: true,
        user: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
        },
      },
    },
  });

  // サインアップ
  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      setIsLoading(true);
      try {
        const result = await executeSignup({ name, email, password });

        if (result.error) {
          return { success: false, message: result.error.message };
        }

        const data = result.data?.signup;
        if (!data) {
          return { success: false, message: "レスポンスが不正です" };
        }

        if (data.success && data.user) {
          setUser({
            id: data?.user?.id ?? "",
            name: data?.user?.name ?? "",
            email: data?.user?.email ?? "",
            emailVerified: data?.user?.emailVerified ?? false,
          });
        }

        return { success: data.success ?? false, message: data.message ?? "" };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error
            ? error.message
            : "エラーが発生しました",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [executeSignup],
  );

  // ログイン
  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      setIsLoading(true);
      try {
        const result = await executeLogin({ email, password });

        if (result.error) {
          return { success: false, message: result.error.message };
        }

        const data = result.data?.login;
        if (!data) {
          return { success: false, message: "レスポンスが不正です" };
        }

        if (data.success && data.user) {
          setUser({
            id: data?.user?.id ?? "",
            name: data?.user?.name ?? "",
            email: data?.user?.email ?? "",
            emailVerified: data?.user?.emailVerified ?? false,
          });
        }

        return { success: data.success ?? false, message: data.message ?? "" };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error
            ? error.message
            : "エラーが発生しました",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [executeLogin],
  );

  // ログアウト
  const logout = useCallback(async () => {
    try {
      await fetch("/auth/logout", { method: "POST" });
    } catch {
      // エラーは無視
    }
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading: isLoading || signupResult.fetching || loginResult.fetching,
    isAuthenticated: user !== null,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useAuth フック
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
