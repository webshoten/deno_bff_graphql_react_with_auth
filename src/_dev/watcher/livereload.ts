/**
 * ライブリロード機能
 */

import type { Hono } from "hono";

const liveReloadClients = new Set<WebSocket>();

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

export function setupLiveReload(app: Hono): void {
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

export function injectLiveReloadScript(
  html: string,
  timestamp: number,
): string {
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

  return html
    .replace('/main.bundle.js"', `/main.bundle.js?v=${timestamp}"`)
    .replace("</body>", liveReloadScript);
}
