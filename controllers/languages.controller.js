import { db } from "../config/db.ts";

import { eq, sql } from "drizzle-orm";

import { languages as languagesSchema } from "../database/schema/languages.ts";

async function doFullTextSearch(query) {
  const result = await db.execute(sql`
        SELECT * 
          FROM languages 
          WHERE (setweight(to_tsvector(name), 'A') ||
                 setweight(coalesce(to_tsvector(description), ''), 'B') 
                 @@ to_tsquery(${query}))
    `);

  return result;
}

export async function index(req, res) {
  const { search } = req.query;

  let languages;

  if (!search) {
    languages = await db.select().from(languagesSchema);
  } else {
    const result = await doFullTextSearch(search);
    languages = result.rows;
  }

  res.status(200).json(languages);
}

export async function store(req, res) {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const language = await db
    .insert(languagesSchema)
    .values({ name, description })
    .returning();

  res.json(language);
}

export async function edit(req, res) {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const language = await db.insert(languagesSchema).values({
    ...req.body,
    id,
  })
    .onConflictDoUpdate({
      target: languagesSchema.id,
      set: { ...req.body, id },
    })
    .returning();

  res.json(language);
}

export async function destroy(req, res) {
  const { id } = req.params;

  await db.delete(languagesSchema).where(eq(languagesSchema.id, id));

  res.status(204).send();
}
