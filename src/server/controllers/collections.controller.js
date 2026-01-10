import { db } from "../../../config/db.ts";

import { eq, sql } from "drizzle-orm";

import { collections as collectionsSchema } from "../../../database/schema/collections.ts";
import { CollectionSchema } from "../dtos/collection.js";

export async function index(req, res) {
  const { search } = req.query;

  let collections;

  if (!search) {
    collections = await db.select().from(collectionsSchema);
  } else {
    const result = await db.select().from(collectionsSchema).where(
      sql`search_vector @@ to_tsquery(${search})`,
    );

    collections = result;
  }

  res.status(200).json(collections);
}

export async function store(req, res) {
  const { name, description } = CollectionSchema.omit({ id: true }).parse(
    req.body,
  );

  const collection = await db
    .insert(collectionsSchema)
    .values({ name, description })
    .returning();

  res.json(collection);
}

export async function edit(req, res) {
  const { id } = req.params;

  const data = CollectionSchema.parse({
    ...req.body,
    id: Number(id),
  });

  const collection = await db.insert(collectionsSchema).values(data)
    .onConflictDoUpdate({
      target: collectionsSchema.id,
      set: data,
    })
    .returning();

  res.json(collection);
}

export async function destroy(req, res) {
  const { id } = req.params;

  await db.delete(collectionsSchema).where(eq(collectionsSchema.id, id));

  res.status(204).send();
}
