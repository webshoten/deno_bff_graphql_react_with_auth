// Reactアプリケーションを esbuild でバンドルするスクリプト

import * as esbuild from "esbuild";
import { denoPlugins } from "esbuild-deno-loader";

export async function buildReactApp() {
  try {
    const inputFile = "./public/main.tsx";
    const outputDir = "./dist";
    const outputFile = "./dist/main.bundle.js";

    // distディレクトリが存在しない場合は作成
    try {
      await Deno.stat(outputDir);
    } catch {
      await Deno.mkdir(outputDir, { recursive: true });
    }

    console.log("🔄 Reactアプリケーションをバンドル中...");
    console.log(`   入力: ${inputFile}`);
    console.log(`   出力: ${outputFile}`);

    // 環境変数を取得（Firebase 設定）
    const firebaseEnv = {
      FIREBASE_API_KEY: Deno.env.get("FIREBASE_API_KEY") || "",
      FIREBASE_AUTH_DOMAIN: Deno.env.get("FIREBASE_AUTH_DOMAIN") || "",
      FIREBASE_PROJECT_ID: Deno.env.get("FIREBASE_PROJECT_ID") || "",
      FIREBASE_STORAGE_BUCKET: Deno.env.get("FIREBASE_STORAGE_BUCKET") || "",
      FIREBASE_MESSAGING_SENDER_ID:
        Deno.env.get("FIREBASE_MESSAGING_SENDER_ID") || "",
      FIREBASE_APP_ID: Deno.env.get("FIREBASE_APP_ID") || "",
      FIREBASE_MEASUREMENT_ID: Deno.env.get("FIREBASE_MEASUREMENT_ID") || "",
    };

    // esbuild でバンドル
    const result = await esbuild.build({
      entryPoints: [inputFile],
      bundle: true,
      outfile: outputFile,
      format: "esm",
      platform: "browser",
      target: ["chrome100", "firefox100", "safari15"],
      sourcemap: "inline",
      jsx: "automatic",
      jsxImportSource: "react",
      plugins: [
        ...denoPlugins({
          importMapURL: new URL("../../import_map.json", import.meta.url).href,
        }),
      ],
      // 環境変数をバンドルに埋め込む
      define: {
        "process.env.NODE_ENV": '"production"',
        "process.env.FIREBASE_API_KEY": JSON.stringify(
          firebaseEnv.FIREBASE_API_KEY,
        ),
        "process.env.FIREBASE_AUTH_DOMAIN": JSON.stringify(
          firebaseEnv.FIREBASE_AUTH_DOMAIN,
        ),
        "process.env.FIREBASE_PROJECT_ID": JSON.stringify(
          firebaseEnv.FIREBASE_PROJECT_ID,
        ),
        "process.env.FIREBASE_STORAGE_BUCKET": JSON.stringify(
          firebaseEnv.FIREBASE_STORAGE_BUCKET,
        ),
        "process.env.FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
          firebaseEnv.FIREBASE_MESSAGING_SENDER_ID,
        ),
        "process.env.FIREBASE_APP_ID": JSON.stringify(
          firebaseEnv.FIREBASE_APP_ID,
        ),
        "process.env.FIREBASE_MEASUREMENT_ID": JSON.stringify(
          firebaseEnv.FIREBASE_MEASUREMENT_ID,
        ),
      },
    });

    if (result.errors.length > 0) {
      console.error("❌ バンドルエラー:", result.errors);
      throw new Error("バンドルに失敗しました");
    }

    console.log("✅ バンドルが完了しました");
    console.log(`   出力ファイル: ${outputFile}`);

    // esbuild のプロセスを停止
    await esbuild.stop();
  } catch (error) {
    console.error("❌ バンドルエラー:", error);
    await esbuild.stop();
    throw error;
  }
}

if (import.meta.main) {
  await buildReactApp();
}
