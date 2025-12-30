// 認証必須のHoC（Higher-order Component）

import { type ComponentType } from "react";
import { useAuth } from "../context/AuthContext.tsx";

type WithAuthOptions = {
  // 未認証時に表示するコンポーネント（デフォルト: null）
  fallback?: ComponentType;
  // ローディング中に表示するコンポーネント
  loading?: ComponentType;
};

/**
 * 認証必須のコンポーネントをラップするHoC
 *
 * 使用例:
 * const ProtectedPage = withAuth(MyComponent);
 * const ProtectedPage = withAuth(MyComponent, { fallback: LoginForm });
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {},
): ComponentType<P> {
  const { fallback: FallbackComponent, loading: LoadingComponent } = options;

  function AuthenticatedComponent(props: P) {
    const { user, isLoading, isAuthenticated } = useAuth();

    // ローディング中
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
          </div>
        </div>
      );
    }

    // 未認証
    if (!isAuthenticated) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>このページを表示するにはログインが必要です。</p>
        </div>
      );
    }

    // 認証済み
    return <WrappedComponent {...props} />;
  }

  // displayName を設定（デバッグ用）
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name ||
    "Component";
  AuthenticatedComponent.displayName = `withAuth(${wrappedName})`;

  return AuthenticatedComponent;
}

/**
 * 認証済みの場合のみ children を表示するコンポーネント
 *
 * 使用例:
 * <AuthRequired>
 *   <ProtectedContent />
 * </AuthRequired>
 */
type AuthRequiredProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
};

export function AuthRequired({
  children,
  fallback,
  loading,
}: AuthRequiredProps) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      loading ?? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return (
      fallback ?? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>このコンテンツを表示するにはログインが必要です。</p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
