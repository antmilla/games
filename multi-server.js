// Multi-game dev server: serves ALL of Camilla's games from one process,
// so cross-game links (like the Flying Cat ad's "PLAY NOW!") work locally
// just like on GitHub Pages.
//
// Routes:
//   /                     → /flying-cat/index.html (default)
//   /<game-name>/         → /<game-name>/index.html
//   /<game-name>/file.ext → that file
//   /__reload             → WebSocket for live reload
//
// Run from /home/fernandez/games:  bun multi-server.js

import { watch } from "node:fs";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const PORT = 3000;
const ROOT = import.meta.dir;
const DEFAULT_GAME = "flying-cat";

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
    let path = url.pathname;
    // Default route → flying-cat
    if (path === "/" || path === "") path = "/" + DEFAULT_GAME + "/index.html";
    // Trailing slash → look for index.html
    if (path.endsWith("/")) path += "index.html";
    const filePath = join(ROOT, decodeURIComponent(path));
    // Block path traversal
    if (!filePath.startsWith(ROOT)) return new Response("Forbidden", { status: 403 });
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      return new Response("Not found: " + path, { status: 404 });
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
  if (!filename || filename.startsWith(".") || filename.includes("node_modules")) return;
  for (const ws of sockets) {
    try { ws.send("reload"); } catch {}
  }
});

console.log(`multi-game dev server running at http://localhost:${PORT}`);
console.log(`default → /${DEFAULT_GAME}/`);
