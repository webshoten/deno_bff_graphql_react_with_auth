/**
 * スキーマ監視
 * ./src/server/schema を監視して、変更があれば型定義を自動生成
 */

import { runGenerateGenQL } from "../generate/generate-genql.ts";
import { runGenerateSchema } from "../generate/generate-schema.ts";
import { runBuild } from "./public-watcher.ts";

const SCHEMA_PATH = "./src/server/schema";
const DEBOUNCE_MS = 100;

async function generateTypes(): Promise<void> {
  console.log("🔄 型定義を自動生成中...");
  await runGenerateSchema();
  await runGenerateGenQL();
  console.log("✅ 型定義の自動生成が完了しました");

  console.log("🔄 バンドルを再生成中...");
  await runBuild();
}

export async function startSchemaWatcher(): Promise<void> {
  console.log(`📁 スキーマファイルを監視中: ${SCHEMA_PATH}`);

  try {
    const watcher = Deno.watchFs(SCHEMA_PATH);

    for await (const event of watcher) {
      const isTargetEvent = event.kind === "modify" || event.kind === "create";
      const hasTsFile = event.paths.some((p) => p.endsWith(".ts"));

      if (isTargetEvent && hasTsFile) {
        const changedFiles = event.paths
          .filter((p) => p.endsWith(".ts"))
          .map((p) => p.split("/").pop());
        console.log(
          `🔄 スキーマファイルが変更されました: ${changedFiles.join(", ")}`,
        );

        await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_MS));

        try {
          await generateTypes();
        } catch (error) {
          console.error("⚠️ 型定義の自動生成に失敗しました:", error);
        }
      }
    }
  } catch (error) {
    console.error("❌ スキーマ監視エラー:", error);
  }
}

if (import.meta.main) {
  await startSchemaWatcher();
}
