// Tiny static file server with auto-reload via WebSocket.
// Watches the folder; when any file changes, tells the page to reload.
import { watch } from "node:fs";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const PORT = 3000;
const ROOT = import.meta.dir;

const RELOAD_SNIPPET = `
<script>
(function(){
  try {
    const ws = new WebSocket('ws://' + location.host + '/__reload');
    ws.onmessage = (e) => { if (e.data === 'reload') location.reload(); };
  } catch (e) { console.warn('reload ws failed', e); }
})();
</script>`;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".json": "application/json",
  ".mp3":  "audio/mpeg",
  ".wav":  "audio/wav",
  ".ogg":  "audio/ogg",
};

const sockets = new Set();

const server = Bun.serve({
  port: PORT,
  async fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/__reload") {
      if (server.upgrade(req)) return;
      return new Response("upgrade failed", { status: 400 });
    }
    let path = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = join(ROOT, decodeURIComponent(path));
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      return new Response("Not found", { status: 404 });
    }
    const ext = extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    let body = readFileSync(filePath);
    if (ext === ".html") {
      body = body.toString().replace("</body>", RELOAD_SNIPPET + "</body>");
      return new Response(body, { headers: { "Content-Type": type } });
    }
    return new Response(body, { headers: { "Content-Type": type } });
  },
  websocket: {
    open(ws) { sockets.add(ws); },
    close(ws) { sockets.delete(ws); },
    message() {},
  },
});

watch(ROOT, { recursive: true }, (event, filename) => {
  if (!filename || filename.startsWith(".")) return;
  for (const ws of sockets) {
    try { ws.send("reload"); } catch {}
  }
});

console.log(`magical-forest dev server running at http://localhost:${PORT}`);
