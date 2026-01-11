/**
 * サーバーエントリーポイント
 */

import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { createYoga } from "graphql-yoga";
import { type GraphQLContext, schema } from "./schema/schema.ts";
import { initializeData } from "../core/kv/index.ts";
import { verifyAuthHeader } from "../core/firebase/verify-token.ts";

export const app = new Hono();
const port = parseInt(Deno.env.get("PORT") || "4000");

const isProduction = Deno.env.get("DENO_ENV") === "production" ||
  Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

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

// GraphQLエンドポイント
app.all("/graphql", async (c) => {
  const authHeader = c.req.header("authorization");
  const currentUser = await verifyAuthHeader(authHeader ?? null);

  const url = new URL(c.req.url);
  const baseUrl = Deno.env.get("APP_BASE_URL") ||
    `${url.protocol}//${url.host}`;

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
  const hasExtension = /\.\w+$/.test(path);

  if (hasExtension) {
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
    return serveStatic({ root: "./dist" })(c, next);
  }

  const html = await Deno.readTextFile("./public/index.html");
  return c.html(html);
});

export async function startServer() {
  await initializeData();
  console.log(`📄 HTML endpoint: http://localhost:${port}/`);
  Deno.serve({ port }, app.fetch);
}

if (import.meta.main) {
  await startServer();
}
