/**
 * public監視
 * ./public を監視して、変更があればバンドルを再生成してライブリロード
 *
 * フロー:
 * 1. public/ 内のファイル変更を検知
 * 2. React アプリをバンドル
 * 3. ライブリロード通知を送信
 */

import { buildReactApp } from "../build.ts";

const WATCH_PATHS = ["./public"];
const DEBOUNCE_MS = 100;

let isBuilding = false;
let buildQueue = false;

// ライブリロード通知関数（外部から設定）
let notifyLiveReload: (() => void) | null = null;

/**
 * ライブリロード通知関数を設定
 */
export function setLiveReloadNotifier(fn: () => void): void {
  notifyLiveReload = fn;
}

/**
 * ビルドを実行（キュー管理付き）
 */
async function runBuild(): Promise<void> {
  if (isBuilding) {
    buildQueue = true;
    return;
  }

  isBuilding = true;
  buildQueue = false;

  try {
    await buildReactApp();

    // ビルド成功時にライブリロード通知
    if (notifyLiveReload) {
      notifyLiveReload();
    }
  } catch (error) {
    console.error("❌ ビルドエラー:", error);
  } finally {
    isBuilding = false;

    // キューにビルドが残っている場合は再実行
    if (buildQueue) {
      await runBuild();
    }
  }
}

/**
 * publicフォルダの監視を開始
 */
export async function startPublicWatcher(): Promise<void> {
  console.log("📁 ファイル監視を開始しました");
  console.log("   監視対象:");
  WATCH_PATHS.forEach((path) => console.log(`   - ${path}`));

  // 初回ビルドを実行
  console.log("🔄 初回ビルドを実行中...");
  await runBuild();

  // ファイル監視を開始
  try {
    const watcher = Deno.watchFs(WATCH_PATHS);

    for await (const event of watcher) {
      if (event.kind === "modify" || event.kind === "create") {
        console.log(`🔄 ファイル変更を検知: ${event.paths.join(", ")}`);

        // デバウンス（ファイル書き込み完了を待つ）
        await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_MS));
        await runBuild();
      }
    }
  } catch (error) {
    console.error("❌ public監視エラー:", error);
  }
}

// 直接実行された場合
if (import.meta.main) {
  await startPublicWatcher();
}
