/**
 * 本番用エントリーポイント
 *
 * 責務:
 * - GraphQL エンドポイント
 * - 静的ファイル配信
 * - ライブリロード WebSocket（開発環境）
 */

import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { createYoga } from "graphql-yoga";
import { type GraphQLContext, schema } from "./schema/schema.ts";
import { initializeData } from "../core/kv/index.ts";
import { verifyAuthHeader } from "../core/firebase/verify-token.ts";

const app = new Hono();
const port = parseInt(Deno.env.get("PORT") || "4000");

// Content-Type を拡張子から取得
function getContentType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = {
    js: "application/javascript",
    mjs: "application/javascript",
    css: "text/css",
    html: "text/html",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    eot: "application/vnd.ms-fontobject",
  };
  return types[ext ?? ""] ?? "application/octet-stream";
}

// ライブリロード用WebSocketクライアント管理
const liveReloadClients = new Set<WebSocket>();

/**
 * ライブリロード通知（watcher から呼び出される）
 */
export function notifyLiveReload(): void {
  console.log(
    `🔄 ライブリロード通知を送信 (${liveReloadClients.size} クライアント)`,
  );
  for (const client of liveReloadClients) {
    try {
      client.send("reload");
    } catch {
      liveReloadClients.delete(client);
    }
  }
}

// 開発環境用：ライブリロード機能
if (Deno.env.get("DENO_ENV") !== "production") {
  // WebSocketエンドポイント（ライブリロード用）
  app.get("/__livereload", (c) => {
    const upgrade = c.req.header("upgrade");
    if (upgrade?.toLowerCase() !== "websocket") {
      return c.text("WebSocket upgrade required", 400);
    }

    const { response, socket } = Deno.upgradeWebSocket(c.req.raw);

    socket.onopen = () => {
      liveReloadClients.add(socket);
      console.log(
        `🔌 ライブリロード接続 (${liveReloadClients.size} クライアント)`,
      );
    };

    socket.onclose = () => {
      liveReloadClients.delete(socket);
      console.log(
        `🔌 ライブリロード切断 (${liveReloadClients.size} クライアント)`,
      );
    };

    socket.onerror = () => {
      liveReloadClients.delete(socket);
    };

    return response;
  });
}

// GraphQLエンドポイント
app.all("/graphql", async (c) => {
  // Authorization ヘッダーから Firebase ID トークンを検証
  const authHeader = c.req.header("authorization");
  const currentUser = await verifyAuthHeader(authHeader ?? null);

  // リクエストからベースURLを取得
  const url = new URL(c.req.url);
  const baseUrl = Deno.env.get("APP_BASE_URL") ||
    `${url.protocol}//${url.host}`;

  // GraphQL Yoga を実行（コンテキストにユーザー情報を渡す）
  const yoga = createYoga<GraphQLContext>({
    schema,
    graphqlEndpoint: "/graphql",
    context: () => ({ currentUser, baseUrl }),
  });

  return await yoga.fetch(c.req.raw);
});

// 静的ファイル配信 + SPA フォールバック
app.use("/*", async (c, next) => {
  const path = c.req.path;

  // 本番環境かどうかを判定
  const isProduction = Deno.env.get("DENO_ENV") === "production" ||
    Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

  // 拡張子があるパスは静的ファイルとして扱う
  const hasExtension = /\.\w+$/.test(path);

  if (hasExtension) {
    // 開発環境ではキャッシュを無効化してファイルを直接配信
    if (!isProduction) {
      try {
        const distPath = `./dist${path}`;
        const content = await Deno.readFile(distPath);
        const contentType = getContentType(path);
        return new Response(content, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      } catch {
        return c.notFound();
      }
    }

    // 本番環境ではserveStaticを使用
    return serveStatic({ root: "./dist" })(c, next);
  }

  // 拡張子がないパスは SPA フォールバック（index.html を返す）
  const html = await Deno.readTextFile("./public/index.html");
  const timestamp = Date.now();

  // 開発環境ではライブリロードスクリプトを注入
  if (!isProduction) {
    const liveReloadScript = `
    <script>
      (function() {
        const ws = new WebSocket("ws://" + location.host + "/__livereload");
        ws.onmessage = function(e) {
          if (e.data === "reload") {
            console.log("🔄 ライブリロード実行");
            location.reload();
          }
        };
        ws.onclose = function() {
          console.log("🔌 ライブリロード切断、3秒後に再接続...");
          setTimeout(function() { location.reload(); }, 3000);
        };
      })();
    </script>
  </body>`;

    const modifiedHtml = html
      .replace('/main.bundle.js"', `/main.bundle.js?v=${timestamp}"`)
      .replace("</body>", liveReloadScript);

    return c.html(modifiedHtml);
  }

  return c.html(html);
});

// 初期データを投入
await initializeData();

console.log(`📄 HTML endpoint: http://localhost:${port}/`);

// Deno のネイティブ Web サーバ API
Deno.serve({ port }, app.fetch);

