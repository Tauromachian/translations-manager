import { db } from "../../../config/db.ts";

import { eq } from "drizzle-orm";

import { languages as languagesSchema } from "../../../database/schema/languages.ts";
import { LanguageSchema } from "../dtos/languages.js";

export async function index(req, res) {
  const { filter } = req.query;

  const languages = await db.select().from(languagesSchema).where(
    eq(languagesSchema.collectionId, filter.collectionId),
  );

  res.status(200).json(languages);
}

export async function store(req, res) {
  const result = LanguageSchema.omit({ id: true }).safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const language = await db
    .insert(languagesSchema)
    .values(req.body)
    .returning();

  res.json(language);
}

export async function edit(req, res) {
  const { id } = req.params;

  const result = LanguageSchema.safeParse({ ...req.body, id });

  if (!result.success) {
    return res.status(400).json(result.error);
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
