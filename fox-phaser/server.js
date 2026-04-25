import indexHTML from "./index.html";

const server = Bun.serve({
    port: 3000,
    routes: {
        "/": indexHTML
    },
    development: {
        hmr: true
    }
});

console.log(`🦊 Fox Explorer (Phaser) running at http://localhost:${server.port}`);
