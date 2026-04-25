import indexHTML from "./index.html";

const server = Bun.serve({
    port: 3001,
    routes: {
        "/": indexHTML
    },
    development: {
        hmr: true
    }
});

console.log(`🦎 Axolotl Treasure Hunt running at http://localhost:${server.port}`);
