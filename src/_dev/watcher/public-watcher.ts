/**
 * public監視
 * ./public を監視して、変更があればバンドルを再生成してライブリロード
 */

import { buildReactApp } from "../bundle/build.ts";

const WATCH_PATHS = ["./public"];
const DEBOUNCE_MS = 500;
const IGNORE_PATTERNS = ["/generated/", "/generated\\"];

let isBuilding = false;
let buildQueue = false;
let debounceTimer: number | null = null;
const pendingPaths: Set<string> = new Set();

let notifyLiveReload: (() => void) | null = null;

export function setLiveReloadNotifier(fn: () => void): void {
  notifyLiveReload = fn;
}

export async function runBuild(): Promise<void> {
  if (isBuilding) {
    buildQueue = true;
    return;
  }

  isBuilding = true;
  buildQueue = false;

  try {
    await buildReactApp();
    if (notifyLiveReload) {
      notifyLiveReload();
    }
  } catch (error) {
    console.error("❌ ビルドエラー:", error);
  } finally {
    isBuilding = false;
    if (buildQueue) {
      await runBuild();
    }
  }
}

function scheduleBuild(paths: string[]): void {
  for (const p of paths) {
    pendingPaths.add(p);
  }

  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    debounceTimer = null;
    const changedFiles = Array.from(pendingPaths)
      .map((p) => p.split("/").pop())
      .join(", ");
    console.log(`🔄 ファイル変更を検知: ${changedFiles}`);
    pendingPaths.clear();
    await runBuild();
  }, DEBOUNCE_MS);
}

export async function startPublicWatcher(): Promise<void> {
  console.log("📁 ファイル監視を開始しました");
  console.log("   監視対象:");
  WATCH_PATHS.forEach((path) => console.log(`   - ${path}`));

  console.log("🔄 初回ビルドを実行中...");
  await runBuild();

  try {
    const watcher = Deno.watchFs(WATCH_PATHS);

    for await (const event of watcher) {
      if (event.kind === "modify" || event.kind === "create") {
        const shouldIgnore = event.paths.every((path) =>
          IGNORE_PATTERNS.some((pattern) => path.includes(pattern))
        );

        if (shouldIgnore) {
          continue;
        }

        scheduleBuild(event.paths);
      }
    }
  } catch (error) {
    console.error("❌ public監視エラー:", error);
  }
}

if (import.meta.main) {
  await startPublicWatcher();
}
