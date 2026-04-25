const fs = require('fs');
const path = require('path');

// Live reload script
const liveReloadScript = `
<script>
  const eventSource = new EventSource('/events');
  eventSource.onmessage = () => {
    location.reload();
  };
</script>
`;

let clients = [];

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // Server-Sent Events endpoint for live reload
    if (url.pathname === '/events') {
      const stream = new ReadableStream({
        start(controller) {
          clients.push(controller);

          // Send a comment every 30 seconds to keep connection alive
          const keepAlive = setInterval(() => {
            try {
              controller.enqueue(': keepalive\n\n');
            } catch (e) {
              clearInterval(keepAlive);
            }
          }, 30000);

          req.signal.addEventListener('abort', () => {
            clearInterval(keepAlive);
            clients = clients.filter(c => c !== controller);
          });
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Serve index.html
    if (url.pathname === '/' || url.pathname === '/index.html') {
      try {
        let html = await Bun.file('index.html').text();
        // Inject live reload script
        html = html.replace('</body>', `${liveReloadScript}</body>`);

        return new Response(html, {
          headers: { 'Content-Type': 'text/html' },
        });
      } catch (e) {
        return new Response('File not found', { status: 404 });
      }
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`⛏️ Minecraft 2D Creative running at http://localhost:${server.port}`);
console.log('👀 Watching for changes...');

// Watch for file changes
const watcher = fs.watch('.', { recursive: false }, (eventType, filename) => {
  if (filename === 'index.html') {
    console.log(`🔄 ${filename} changed, reloading...`);
    // Notify all connected clients
    clients.forEach(controller => {
      try {
        controller.enqueue('data: reload\n\n');
      } catch (e) {
        // Client disconnected
      }
    });
  }
});

// Clean up on exit
process.on('SIGINT', () => {
  watcher.close();
  process.exit();
});
