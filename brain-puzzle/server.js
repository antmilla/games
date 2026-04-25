const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Store SSE clients
let clients = [];

// Create server
const server = Bun.serve({
    port: PORT,
    fetch(req) {
        const url = new URL(req.url);

        // SSE endpoint for live reload
        if (url.pathname === '/events') {
            const stream = new ReadableStream({
                start(controller) {
                    clients.push(controller);

                    // Send initial connection message
                    const encoder = new TextEncoder();
                    controller.enqueue(encoder.encode('data: connected\n\n'));

                    // Cleanup on close
                    req.signal.addEventListener('abort', () => {
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
            const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

            // Inject live reload script
            const liveReloadScript = `
                <script>
                    const eventSource = new EventSource('/events');
                    eventSource.onmessage = () => {
                        location.reload();
                    };
                </script>
            `;

            const modifiedHtml = html.replace('</body>', liveReloadScript + '</body>');

            return new Response(modifiedHtml, {
                headers: { 'Content-Type': 'text/html' },
            });
        }

        return new Response('Not Found', { status: 404 });
    },
});

console.log(`🦊 Fox Explorer running at http://localhost:${PORT}`);
console.log('👀 Watching for changes...');

// Watch for file changes
fs.watch(__dirname, (eventType, filename) => {
    if (filename === 'index.html') {
        console.log(`🔄 ${filename} changed, reloading...`);

        // Notify all clients
        const encoder = new TextEncoder();
        clients.forEach(client => {
            try {
                client.enqueue(encoder.encode('data: reload\n\n'));
            } catch (e) {
                // Client disconnected
            }
        });
    }
});
