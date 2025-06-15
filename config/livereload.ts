import { join } from "https://deno.land/std/path/mod.ts";

const sockets = new Set<WebSocket>();

export function start() {
  Deno.serve({
    port: 35989,
    handler: (req) => {
      const { socket, response } = Deno.upgradeWebSocket(req);

      sockets.add(socket);

      socket.onopen = () => socket.send("Connected to live reload");
      socket.onclose = () => sockets.delete(socket);

      return response;
    },
  });

  (async function startFileWatcher() {
    const distWatcher = Deno.watchFs([
      join(Deno.cwd(), "public"),
      join(Deno.cwd(), "src/admin/index.html"),
    ], {
      recursive: true,
    });

    for await (const event of distWatcher) {
      if (!event.paths.length) return;

      console.log(`File changed: ${event.paths[0]}`);

      sockets.forEach((socket) => {
        try {
          socket.send("reload");
        } catch {
          sockets.delete(socket);
        }
      });
    }
  })();
}
