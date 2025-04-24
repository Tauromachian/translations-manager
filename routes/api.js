import express from "npm:express@5";

export const router = express.Router();

import { db } from "../config/db.ts";

import { collections as collectionsSchema } from "../database/schema/collections.ts";

router.route("/collections")
  .get(async (_, res) => {
    const collections = await db.select().from(collectionsSchema);

    res.json(collections);
  }).post(async (req, res) => {
    const { name, description } = req.body;

    const collection = await db
      .insert(collectionsSchema)
      .values({ name, description })
      .returning();

    res.json(collection);
  });
