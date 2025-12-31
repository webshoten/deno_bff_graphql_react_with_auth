import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            ログアウト
          </button>
        </div>

        {/* ユーザー情報カード */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ユーザー情報
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {user?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user?.name || "名前未設定"}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">メール認証:</span>
                {user?.emailVerified
                  ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      認証済み
                    </span>
                  )
                  : (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      未認証
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* ログイン成功メッセージ */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-center">
            🎉 ログインに成功しました！
          </p>
        </div>
      </div>
    </div>
  );
}
