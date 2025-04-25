import express from "npm:express@5";

export const router = express.Router();

import { db } from "../config/db.ts";

import { eq, sql } from "drizzle-orm";

import { collections as collectionsSchema } from "../database/schema/collections.ts";

async function doFullTextSearch(query) {
  const result = await db.execute(sql`
        SELECT * 
          FROM collections 
          WHERE (setweight(to_tsvector(name), 'A') ||
                 setweight(coalesce(to_tsvector(description), ''), 'B') 
                 @@ to_tsquery(${query}))
    `);

  return result;
}

router.route("/collections")
  .get(async (req, res) => {
    const { search } = req.query;

    let collections;

    if (!search) {
      collections = await db.select().from(collectionsSchema);
    } else {
      const result = await doFullTextSearch(search);
      collections = result.rows;
    }

    res.status(200).json(collections);
  }).post(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const collection = await db
      .insert(collectionsSchema)
      .values({ name, description })
      .returning();

    res.json(collection);
  });

router.route("/collections/:id")
  .all((req, res, next) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: "ID should be a number" });
    }

    next();
  }).delete(async (req, res) => {
    const { id } = req.params;

    await db.delete(collectionsSchema).where(eq(collectionsSchema.id, id));

    res.status(204).send();
  }).put(async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const collection = await db.insert(collectionsSchema).values({
      ...req.body,
      id,
    })
      .onConflictDoUpdate({
        target: collectionsSchema.id,
        set: { ...req.body, id },
      });

    res.status(201).json(collection);
  });
