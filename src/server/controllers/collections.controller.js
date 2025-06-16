import { db } from "../../../config/db.ts";

import { eq, sql } from "drizzle-orm";

import { collections as collectionsSchema } from "../../../database/schema/collections.ts";
import { CollectionSchema } from "../dtos/collection.js";

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

export async function index(req, res) {
  const { search } = req.query;

  let collections;

  if (!search) {
    collections = await db.select().from(collectionsSchema);
  } else {
    const result = await doFullTextSearch(search);
    collections = result.rows;
  }

  res.status(200).json(collections);
}

export async function store(req, res) {
  const { name, description } = req.body;

  const result = CollectionSchema.omit({ id: true }).safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const collection = await db
    .insert(collectionsSchema)
    .values({ name, description })
    .returning();

  res.json(collection);
}

export async function edit(req, res) {
  const { id } = req.params;

  const result = CollectionSchema.safeParse({
    ...req.body,
    id: Number(id),
  });

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const collection = await db.insert(collectionsSchema).values({
    ...req.body,
    id,
  })
    .onConflictDoUpdate({
      target: collectionsSchema.id,
      set: { ...req.body, id },
    })
    .returning();

  res.json(collection);
}

export async function destroy(req, res) {
  const { id } = req.params;

  await db.delete(collectionsSchema).where(eq(collectionsSchema.id, id));

  res.status(204).send();
}
