/**
 * ファイル監視エントリポイント
 *
 * 開発環境で以下を監視:
 * - スキーマ監視: ./src/server/schema → 型定義生成
 * - public監視: ./public → バンドル生成 → ライブリロード
 */

import { startSchemaWatcher } from "./schema-watcher.ts";
import { setLiveReloadNotifier, startPublicWatcher } from "./public-watcher.ts";

export { setLiveReloadNotifier };

/**
 * すべてのウォッチャーを起動
 */
export function startAllWatchers(): void {
  // スキーマ監視を開始（バックグラウンド）
  startSchemaWatcher().catch((error) => {
    console.error("❌ スキーマ監視エラー:", error);
  });

  // public監視を開始（バックグラウンド）
  startPublicWatcher().catch((error) => {
    console.error("❌ public監視エラー:", error);
  });
}

// 直接実行された場合
if (import.meta.main) {
  console.log("🔄 ファイル監視を開始します...");
  startAllWatchers();
}
