import express from "npm:express@5";
import morgan from "npm:morgan";

import { join } from "https://deno.land/std/path/mod.ts";

import { router as webRouter } from "./routes/web.js";

import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(join(Deno.cwd(), "dist")));

app.use("/app", webRouter);

(
  async function init() {
    await load({ export: true });

    app.listen(3000, () => console.log("Server on http://localhost:3000"));
  }
)();

// Livereload implementation
const sockets = new Set();

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
  const distWatcher = Deno.watchFs(join(Deno.cwd(), "dist"), {
    recursive: true,
  });
  const viewsWatcher = Deno.watchFs(join(Deno.cwd(), "views"), {
    recursive: true,
  });

  for await (const event of distWatcher) {
    console.log(`File changed: ${event.paths[0]}`);

    sockets.forEach((socket) => {
      try {
        socket.send("reload");
      } catch {
        sockets.delete(socket);
      }
    });
  }

  for await (const event of viewsWatcher) {
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
