/**
 * スキーマ監視
 * ./src/schema を監視して、変更があれば型定義を自動生成
 *
 * フロー:
 * 1. schema.ts 変更を検知
 * 2. schema.graphql を生成（子プロセスでキャッシュ回避）
 * 3. genql で型定義を生成
 */

import { generateGenQL } from "../generate/generate-genql.ts";
import { runBuild } from "./public-watcher.ts";

const SCHEMA_PATH = "./src/schema";
const DEBOUNCE_MS = 100;

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

  const output = new TextDecoder().decode(result.stdout);
  if (output) {
    console.log(output);
  }
}

/**
 * 型定義を生成（schema.graphql → genql）
 */
async function generateTypes(): Promise<void> {
  console.log("🔄 型定義を自動生成中...");

  // schema.graphql を生成
  await generateSchemaGraphQL();

  // genql で型定義を生成
  await generateGenQL();

  console.log("✅ 型定義の自動生成が完了しました");

  // 型定義生成完了後にバンドルを実行
  console.log("🔄 バンドルを再生成中...");
  await runBuild();
}

/**
 * スキーマファイルの監視を開始
 */
export async function startSchemaWatcher(): Promise<void> {
  console.log(`📁 スキーマファイルを監視中: ${SCHEMA_PATH}`);

  try {
    const watcher = Deno.watchFs(SCHEMA_PATH);

    for await (const event of watcher) {
      if (event.kind === "modify") {
        console.log("🔄 スキーマファイルが変更されました:", event.paths);

        // デバウンス（ファイル書き込み完了を待つ）
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

// 直接実行された場合
if (import.meta.main) {
  await startSchemaWatcher();
}
