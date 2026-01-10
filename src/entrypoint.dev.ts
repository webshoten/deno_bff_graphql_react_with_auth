/**
 * 開発用エントリーポイント
 *
 * 起動するもの:
 * 1. サーバー (entrypoint.prod.ts)
 * 2. ファイル監視 (watcher/)
 *    - スキーマ監視 → 型定義生成
 *    - public監視 → バンドル生成 → ライブリロード
 *
 * 注意:
 * - --watch=src/ で起動すると、src/配下の変更でDenoが自動再起動
 * - サーバー起動時にgenqlを毎回生成することで、スキーマ変更を反映
 */

import { setLiveReloadNotifier, startAllWatchers } from "./watcher/index.ts";
import { generateGenQL } from "./generate/generate-genql.ts";

/**
 * schema.graphql を生成（子プロセスで実行してDenoのモジュールキャッシュを回避）
 */
async function generateSchemaGraphQL(): Promise<void> {
  const command = new Deno.Command("deno", {
    args: ["run", "-A", "./src/generate/generate-schema.ts"],
    stdout: "piped",
    stderr: "piped",
  });

  const result = await command.output();

  if (!result.success) {
    const errorText = new TextDecoder().decode(result.stderr);
    throw new Error(`schema.graphql生成失敗: ${errorText}`);
  }
}

if (import.meta.main) {
  // サーバー起動時にスキーマを生成（--watchによる再起動時も実行される）
  console.log("🔄 スキーマを生成中...");
  try {
    await generateSchemaGraphQL();
    await generateGenQL();
    console.log("✅ スキーマ生成完了");
  } catch (error) {
    console.error("⚠️ スキーマ生成に失敗:", error);
  }

  // サーバーを起動
  console.log("🚀 サーバーを起動中...");
  const server = await import("./entrypoint.prod.ts");

  // ライブリロード通知を設定
  if (server.notifyLiveReload) {
    setLiveReloadNotifier(server.notifyLiveReload);
    console.log("🔌 ライブリロード機能を有効化しました");
  }

  // ファイル監視を開始（public監視のみ有効、スキーマは--watchが処理）
  startAllWatchers();
}
