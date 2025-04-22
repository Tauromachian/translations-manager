import express from "npm:express@5";
import morgan from "npm:morgan";

import { join } from "https://deno.land/std/path/mod.ts";

import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import { start as livereloadStart } from "./config/livereload.ts";

import { router as webRouter } from "./routes/web.js";
import { router as apiRouter } from "./routes/api.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(join(Deno.cwd(), "dist")));

app.use("/app", webRouter);
app.use("/api", apiRouter);

(
  async function init() {
    await load({ export: true });

    app.listen(3000, () => console.log("Server on http://localhost:3000"));

    livereloadStart();
  }
)();
