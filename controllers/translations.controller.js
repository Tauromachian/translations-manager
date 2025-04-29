import { db } from "../config/db.ts";

import { eq, sql } from "drizzle-orm";

import { translations as translationsSchema } from "../database/schema/translations.ts";

async function doFullTextSearch(query) {
  const result = await db.execute(sql`
        SELECT * 
          FROM translations 
          WHERE (setweight(to_tsvector(name), 'A') ||
                 setweight(coalesce(to_tsvector(description), ''), 'B') 
                 @@ to_tsquery(${query}))
    `);

  return result;
}

export async function index(req, res) {
  const { search } = req.query;

  let translations;

  if (!search) {
    translations = await db.select().from(translationsSchema);
  } else {
    const result = await doFullTextSearch(search);
    translations = result.rows;
  }

  res.status(200).json(translations);
}

export async function store(req, res) {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const translation = await db
    .insert(translationsSchema)
    .values({ name, description })
    .returning();

  res.json(translation);
}

export async function edit(req, res) {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const translation = await db.insert(translationsSchema).values({
    ...req.body,
    id,
  })
    .onConflictDoUpdate({
      target: translationsSchema.id,
      set: { ...req.body, id },
    })
    .returning();

  res.json(translation);
}

export async function destroy(req, res) {
  const { id } = req.params;

  await db.delete(translationsSchema).where(eq(translationsSchema.id, id));

  res.status(204).send();
}
