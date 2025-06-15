import express from "npm:express@5";

import { join } from "https://deno.land/std/path/mod.ts";

export const router = express.Router();

router.get(/^(.*)/, (_, res) => {
  res.sendFile(join(Deno.cwd(), "src/admin", "index.html"));
});
