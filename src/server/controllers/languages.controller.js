import { db } from "../../../config/db.ts";

import { eq, sql } from "drizzle-orm";

import { languages as languagesSchema } from "../../../database/schema/languages.ts";
import { LanguageSchema } from "../dtos/languages.js";

export async function getLanguageTranslationsForI18N(req, res, next) {
  const { languageCode, collectionId } = req.params;

  if (!languageCode || !collectionId) {
    return next({ message: "Language code and collection ID required" });
  }

  const result = await db.execute(sql`
        SELECT jsonb_object_agg(key, translation) AS json_result FROM 
        (
            SELECT key, translation FROM translations
            INNER JOIN languages ON translations.language_id = languages.id
            WHERE languages.code = ${languageCode} AND languages.collection_id = ${collectionId}
        ) AS codes_translations_table
        `);

  return res.json(result.rows[0].json_result);
}

export async function index(req, res) {
  const { filter } = req.query;

  const languages = await db.select().from(languagesSchema).where(
    eq(languagesSchema.collectionId, filter.collectionId),
  );

  res.status(200).json(languages);
}

export async function store(req, res) {
  const data = LanguageSchema.omit({ id: true }).parse(req.body);

  const language = await db
    .insert(languagesSchema)
    .values(data)
    .returning();

  res.json(language);
}

export async function edit(req, res) {
  const { id } = req.params;

  const data = LanguageSchema.parse({ ...req.body, id: Number(id) });

  const language = await db.insert(languagesSchema).values(data)
    .onConflictDoUpdate({
      target: languagesSchema.id,
      set: data,
    })
    .returning();

  res.json(language);
}

export async function destroy(req, res) {
  const { id } = req.params;

  await db.delete(languagesSchema).where(eq(languagesSchema.id, id));

  res.status(204).send();
}
