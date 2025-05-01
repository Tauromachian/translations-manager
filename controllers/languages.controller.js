import { db } from "../config/db.ts";

import { eq } from "drizzle-orm";

import { languages as languagesSchema } from "../database/schema/languages.ts";

export async function index(_, res) {
  const languages = await db.select().from(languagesSchema);

  res.status(200).json(languages);
}

export async function store(req, res) {
  const { name, code } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const language = await db
    .insert(languagesSchema)
    .values({ name, code })
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
