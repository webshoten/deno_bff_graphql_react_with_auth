/**
 * PothosスキーマからGraphQL SDLを生成
 */

import { printSchema } from "graphql";
import { schema } from "../../server/schema/schema.ts";

function generateSchemaSDL() {
  try {
    return printSchema(schema);
  } catch (error) {
    console.error("❌ SDL生成エラー:", error);
    throw error;
  }
}

export async function generateSchemaSDLFile() {
  try {
    const sdl = generateSchemaSDL();
    await Deno.writeTextFile("./schema/schema.graphql", sdl);
    return sdl;
  } catch (error) {
    console.error("❌ SDL生成エラー:", error);
    throw error;
  }
}

/**
 * 子プロセスでスキーマを生成（Denoのモジュールキャッシュを回避）
 */
export async function runGenerateSchema(): Promise<void> {
  const command = new Deno.Command("deno", {
    args: ["run", "-A", "./src/_dev/generate/generate-schema.ts"],
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

if (import.meta.main) {
  const sdl = generateSchemaSDL();
  await Deno.writeTextFile("./schema/schema.graphql", sdl);
  console.log("✅ GraphQL SDLを生成しました: schema/schema.graphql");
}

export { generateSchemaSDL };
