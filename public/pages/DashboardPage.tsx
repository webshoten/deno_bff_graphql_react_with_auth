import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useTypedQuery } from "../utils/genql-urql-bridge.ts";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ユーザー一覧を取得
  const [usersResult] = useTypedQuery({
    query: {
      users: {
        id: true,
        name: true,
      },
    },
  });

  // 投稿一覧を取得
  const [postsResult] = useTypedQuery({
    query: {
      posts: {
        id: true,
        title: true,
        content: true,
      },
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const users = usersResult.data?.users ?? [];
  const posts = postsResult.data?.posts ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ログイン中のユーザー
          </h2>

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
            {user?.emailVerified && (
              <span className="ml-auto px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                認証済み
              </span>
            )}
          </div>
        </div>

        {/* データ表示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ユーザー一覧 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ユーザー一覧 ({users.length}件)
            </h2>

            {usersResult.fetching
              ? <p className="text-gray-500">読み込み中...</p>
              : usersResult.error
              ? (
                <p className="text-red-500">
                  エラー: {usersResult.error.message}
                </p>
              )
              : users.length === 0
              ? <p className="text-gray-500">ユーザーがいません</p>
              : (
                <ul className="space-y-2">
                  {users.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {u.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <span className="text-gray-900">{u.name}</span>
                      <span className="text-gray-400 text-xs ml-auto">
                        ID: {u.id}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
          </div>

          {/* 投稿一覧 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              投稿一覧 ({posts.length}件)
            </h2>

            {postsResult.fetching
              ? <p className="text-gray-500">読み込み中...</p>
              : postsResult.error
              ? (
                <p className="text-red-500">
                  エラー: {postsResult.error.message}
                </p>
              )
              : posts.length === 0
              ? <p className="text-gray-500">投稿がありません</p>
              : (
                <ul className="space-y-3">
                  {posts.map((p) => (
                    <li key={p.id} className="p-3 bg-gray-50 rounded">
                      <h3 className="font-medium text-gray-900">{p.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {p.content}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
