// Firebase 認証コンテキスト

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  firebaseLogin,
  firebaseLogout,
  firebaseSignup,
  onAuthChange,
  resendVerificationEmail,
} from "../firebase/auth.ts";
import type { User } from "firebase/auth";

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
  firebaseUser: User | null;
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
  resendVerification: () => Promise<{ success: boolean; message: string }>;
};

// コンテキスト作成
const AuthContext = createContext<AuthContextType | null>(null);

// Firebase User を AuthUser に変換
function toAuthUser(firebaseUser: User): AuthUser {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "",
    email: firebaseUser.email || "",
    emailVerified: firebaseUser.emailVerified,
  };
}

// AuthProvider コンポーネント
type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthChange((fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setUser(toAuthUser(fbUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // サインアップ
  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      setIsLoading(true);
      try {
        const result = await firebaseSignup(email, password);

        if (result.success && result.user) {
          // displayName を設定
          const { updateProfile } = await import("firebase/auth");
          await updateProfile(result.user, { displayName: name });

          // ユーザー情報を更新
          setUser({
            id: result.user.uid,
            name: name,
            email: result.user.email || "",
            emailVerified: result.user.emailVerified,
          });
        }

        return { success: result.success, message: result.message };
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
    [],
  );

  // ログイン
  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      setIsLoading(true);
      try {
        const result = await firebaseLogin(email, password);
        return { success: result.success, message: result.message };
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
    [],
  );

  // ログアウト
  const logout = useCallback(async () => {
    await firebaseLogout();
    setUser(null);
    setFirebaseUser(null);
  }, []);

  // 確認メール再送信
  const resendVerification = useCallback(async () => {
    return await resendVerificationEmail();
  }, []);

  // メール認証済みかどうかで認証状態を判定
  const isAuthenticated = user !== null && user.emailVerified;

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
    signup,
    login,
    logout,
    resendVerification,
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
