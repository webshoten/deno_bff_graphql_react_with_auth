/**
 * 開発用エントリーポイント
 */

import { setLiveReloadNotifier, startAllWatchers } from "./watcher/index.ts";
import { generateGenQL } from "./generate/generate-genql.ts";
import { runGenerateSchema } from "./generate/generate-schema.ts";

if (import.meta.main) {
  console.log("🔄 スキーマを生成中...");
  try {
    await runGenerateSchema();
    await generateGenQL();
    console.log("✅ スキーマ生成完了");
  } catch (error) {
    console.error("⚠️ スキーマ生成に失敗:", error);
  }

  console.log("🚀 サーバーを起動中...");
  const server = await import("../server/entrypoint.ts");

  if (server.notifyLiveReload) {
    setLiveReloadNotifier(server.notifyLiveReload);
    console.log("🔌 ライブリロード機能を有効化しました");
  }

  startAllWatchers();
}
