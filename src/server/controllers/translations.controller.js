import { db } from "../../../config/db.ts";

import { and, eq, sql } from "drizzle-orm";

import { translations as translationsSchema } from "../../../database/schema/translations.ts";
import { TranslationsSchema } from "../dtos/translations.js";

export async function index(req, res) {
  const { filter } = req.query;

  const translations = await db.select().from(translationsSchema).where(
    filter?.languagesIds && and(
      sql`language_id IN ${
        Array.isArray(filter.languagesIds)
          ? filter.languagesIds
          : [filter.languagesIds]
      }`,
    ),
  );

  res.json(translations);
}

export async function store(req, res) {
  const data = TranslationsSchema.omit({ id: true }).parse(req.body);

  const translation = await db
    .insert(translationsSchema)
    .values(data)
    .returning();

  res.json(translation);
}

export async function edit(req, res) {
  const { id } = req.params;

  const data = TranslationsSchema.parse({
    ...req.body,
    id: Number(id),
  });

  const translation = await db.insert(translationsSchema).values(data)
    .onConflictDoUpdate({
      target: translationsSchema.id,
      set: data,
    })
    .returning();

  res.json(translation);
}

export async function destroy(req, res) {
  const { id } = req.params;

  await db.delete(translationsSchema).where(eq(translationsSchema.id, id));

  res.status(204).send();
}
