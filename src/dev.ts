/**
 * 開発モード起動スクリプト
 *
 * 起動するもの:
 * 1. サーバー (server.ts)
 * 2. ファイル監視 (watcher/)
 *    - スキーマ監視 → 型定義生成
 *    - public監視 → バンドル生成 → ライブリロード
 */

import { setLiveReloadNotifier, startAllWatchers } from "./watcher/index.ts";

if (import.meta.main) {
  // サーバーを起動
  console.log("🚀 サーバーを起動中...");
  const server = await import("./server.ts");

  // ライブリロード通知を設定
  if (server.notifyLiveReload) {
    setLiveReloadNotifier(server.notifyLiveReload);
    console.log("🔌 ライブリロード機能を有効化しました");
  }

  // ファイル監視を開始
  startAllWatchers();
}
