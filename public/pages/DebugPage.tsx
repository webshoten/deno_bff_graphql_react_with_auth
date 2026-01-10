import { useState } from "react";
import { useTypedMutation, useTypedQuery } from "../utils/genql-urql-bridge.ts";
import { useAuth } from "../context/AuthContext.tsx";

export function DebugPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);

  // 学習履歴の件数を取得
  const [countResult, reexecuteCount] = useTypedQuery({
    query: {
      learningHistoryCount: {
        __args: {
          userId: user?.id ?? "",
        },
      },
    },
    pause: !user?.id,
  });

  // 全体の学習履歴件数
  const [totalCountResult, reexecuteTotalCount] = useTypedQuery({
    query: {
      learningHistoryCount: true,
    },
  });

  // 学習履歴一覧を取得（自分の履歴）
  const [myHistoryResult, reexecuteMyHistory] = useTypedQuery({
    query: {
      learningHistoryList: {
        __args: {
          userId: user?.id ?? "",
          limit: 50,
        },
        id: true,
        wordId: true,
        wordJapanese: true,
        wordEnglish: true,
        learningType: true,
        userId: true,
      },
    },
    pause: !user?.id || showAllUsers,
  });

  // 学習履歴一覧を取得（全ユーザー）
  const [allHistoryResult, reexecuteAllHistory] = useTypedQuery({
    query: {
      learningHistoryList: {
        __args: {
          limit: 100,
        },
        id: true,
        wordId: true,
        wordJapanese: true,
        wordEnglish: true,
        learningType: true,
        userId: true,
      },
    },
    pause: !showAllUsers,
  });

  // リセットミューテーション
  const [_resetResult, resetLearningHistory] = useTypedMutation({
    mutation: {
      resetLearningHistory: {
        __args: {
          userId: "",
        },
        success: true,
        message: true,
        count: true,
      },
    },
  });

  const handleResetMyHistory = async () => {
    if (!user?.id) return;
    if (!confirm("自分の学習履歴をリセットしますか？")) return;

    const result = await resetLearningHistory({ userId: user.id });
    if (result.data?.resetLearningHistory) {
      setMessage(result.data.resetLearningHistory.message);
      reexecuteCount({ requestPolicy: "network-only" });
      reexecuteTotalCount({ requestPolicy: "network-only" });
      reexecuteMyHistory({ requestPolicy: "network-only" });
      reexecuteAllHistory({ requestPolicy: "network-only" });
    }
  };

  const handleResetAllHistory = async () => {
    if (!confirm("全ての学習履歴をリセットしますか？この操作は取り消せません。"))
      return;

    const result = await resetLearningHistory({});
    if (result.data?.resetLearningHistory) {
      setMessage(result.data.resetLearningHistory.message);
      reexecuteCount({ requestPolicy: "network-only" });
      reexecuteTotalCount({ requestPolicy: "network-only" });
      reexecuteMyHistory({ requestPolicy: "network-only" });
      reexecuteAllHistory({ requestPolicy: "network-only" });
    }
  };

  const historyList = showAllUsers
    ? allHistoryResult.data?.learningHistoryList ?? []
    : myHistoryResult.data?.learningHistoryList ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">🛠️ Debug Page</h1>
          <p className="text-slate-400">開発用デバッグツール</p>
        </div>

        {/* メッセージ表示 */}
        {message && (
          <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300">
            {message}
          </div>
        )}

        {/* ユーザー情報 */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            👤 ユーザー情報
          </h2>
          <div className="space-y-2 text-slate-300">
            <p>
              <span className="text-slate-500">ID:</span> {user?.id ?? "未ログイン"}
            </p>
            <p>
              <span className="text-slate-500">Name:</span> {user?.name ?? "-"}
            </p>
            <p>
              <span className="text-slate-500">Email:</span> {user?.email ?? "-"}
            </p>
          </div>
        </div>

        {/* 学習履歴 */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            📚 学習履歴
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-slate-700/50">
              <div className="text-3xl font-bold text-purple-400">
                {countResult.data?.learningHistoryCount ?? 0}
              </div>
              <div className="text-sm text-slate-400">自分の学習回数</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-700/50">
              <div className="text-3xl font-bold text-blue-400">
                {totalCountResult.data?.learningHistoryCount ?? 0}
              </div>
              <div className="text-sm text-slate-400">全体の学習回数</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleResetMyHistory}
              className="w-full py-3 px-4 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-medium transition-colors"
            >
              🔄 自分の学習履歴をリセット
            </button>
            <button
              type="button"
              onClick={handleResetAllHistory}
              className="w-full py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              ⚠️ 全ての学習履歴をリセット
            </button>
          </div>
        </div>

        {/* 学習履歴一覧 */}
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                📋 学習履歴一覧
              </h2>
              <button
                type="button"
                onClick={() => {
                  reexecuteMyHistory({ requestPolicy: "network-only" });
                  reexecuteAllHistory({ requestPolicy: "network-only" });
                }}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                title="最新に更新"
              >
                🔄
              </button>
            </div>
            <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showAllUsers}
                onChange={(e) => setShowAllUsers(e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500"
              />
              全ユーザー表示
            </label>
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              学習履歴がありません
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {historyList.map((history, index) => (
                <div
                  key={history.id}
                  className="p-3 rounded-lg bg-slate-700/50 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs w-6">
                        {index + 1}.
                      </span>
                      <span className="text-white font-medium">
                        {history.wordJapanese}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {history.wordEnglish.join(", ")}
                      </span>
                    </div>
                    {showAllUsers && (
                      <div className="text-xs text-slate-500 ml-6 mt-1">
                        User: {history.userId.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                    {history.learningType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 注意事項 */}
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
          ⚠️ このページは開発用です。本番環境では非表示にしてください。
        </div>
      </div>
    </div>
  );
}

