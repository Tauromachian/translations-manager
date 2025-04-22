import express from "npm:express@5";

export const router = express.Router();

import { db } from "../config/db.ts";

import { collections as collectionsSchema } from "../database/schema/collections.ts";

router.get("/collections", async (_, res) => {
  const collections = await db.select().from(collectionsSchema);

  res.json(collections);
});
