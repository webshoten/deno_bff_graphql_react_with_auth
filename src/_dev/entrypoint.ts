/**
 * 開発用エントリーポイント
 */

import { setLiveReloadNotifier, startAllWatchers } from "./watcher/index.ts";
import { runGenerateGenQL } from "./generate/generate-genql.ts";
import { runGenerateSchema } from "./generate/generate-schema.ts";
import {
  injectLiveReloadScript,
  notifyLiveReload,
  setupLiveReload,
} from "./watcher/livereload.ts";
import { app, startServer } from "../server/entrypoint.ts";

if (import.meta.main) {
  console.log("🔄 スキーマを生成中...");
  try {
    await runGenerateSchema();
    await runGenerateGenQL();
    console.log("✅ スキーマ生成完了");
  } catch (error) {
    console.error("⚠️ スキーマ生成に失敗:", error);
  }

  // ライブリロード機能を追加
  setupLiveReload(app);

  // SPAフォールバックにライブリロードスクリプトを注入
  app.get("/*", async (c) => {
    const path = c.req.path;
    if (/\.\w+$/.test(path)) {
      return c.notFound();
    }
    const html = await Deno.readTextFile("./public/index.html");
    const modifiedHtml = injectLiveReloadScript(html, Date.now());
    return c.html(modifiedHtml);
  });

  // ライブリロード通知を設定
  setLiveReloadNotifier(notifyLiveReload);
  console.log("🔌 ライブリロード機能を有効化しました");

  // サーバーを起動
  console.log("🚀 サーバーを起動中...");
  await startServer();

  // ファイル監視を開始
  startAllWatchers();
}
