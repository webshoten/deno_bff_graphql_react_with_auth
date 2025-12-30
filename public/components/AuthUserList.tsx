import { useCallback } from "react";
import { useTypedMutation, useTypedQuery } from "../utils/genql-urql-bridge.ts";

export function AuthUserList() {
  // 認証ユーザー一覧を取得
  const [{ data, fetching, error }, refetch] = useTypedQuery({
    query: {
      authUsers: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
    },
  });

  // 削除ミューテーション
  const [deleteState, deleteAuthUser] = useTypedMutation({
    mutation: {
      deleteAuthUser: {
        __args: { id: "" }, // プレースホルダー
        id: true,
        name: true,
      },
    },
  });

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (!confirm(`「${name}」を削除しますか？`)) {
        return;
      }

      await deleteAuthUser({ id });

      // 一覧を再取得
      refetch({ requestPolicy: "network-only" });
    },
    [deleteAuthUser, refetch],
  );

  if (fetching) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">エラー: {error.message}</p>
      </div>
    );
  }

  const authUsers = data?.authUsers || [];

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        認証ユーザー一覧 ({authUsers.length}件)
      </h2>

      {authUsers.length === 0
        ? <p className="text-gray-500">認証ユーザーはいません</p>
        : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    名前
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    メール
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    認証
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    登録日
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.emailVerified
                        ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            認証済
                          </span>
                        )
                        : (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            未認証
                          </span>
                        )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("ja-JP")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(user.id ?? "", user.name ?? "")}
                        disabled={deleteState.fetching}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
