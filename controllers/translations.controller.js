import { db } from "../config/db.ts";

import { and, eq, sql } from "drizzle-orm";

import { translations as translationsSchema } from "../database/schema/translations.ts";
import { TranslationsSchema } from "../dtos/translations.js";

export async function index(req, res) {
  const { search, filter } = req.query;

  const translations = await db.select().from(translationsSchema).where(
    and(
      sql`language_id IN ${filter.languagesIds}`,
      search && sql`setweight(to_tsvector(name), 'A') ||
                     setweight(coalesce(to_tsvector(description), ''), 'B') 
                     @@ to_tsquery(${search})`,
    ),
  );

  res.status(200).json(translations);
}

export async function store(req, res) {
  const result = TranslationsSchema.omit({ id: true }).safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const translation = await db
    .insert(translationsSchema)
    .values(req.body)
    .returning();

  res.json(translation);
}

export async function edit(req, res) {
  const { id } = req.params;

  const result = TranslationsSchema.safeParse({
    ...req.body,
    id,
  });

  if (!result.success) {
    return res.status(400).json(result.error);
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
