import { db } from "../../../config/db.ts";

import { eq, sql } from "drizzle-orm";

import { collections as collectionsSchema } from "../../../database/schema/collections.ts";
import { CollectionDto } from "../dtos/collection.js";

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
  const { name, description } = CollectionDto.omit({ id: true }).parse(
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

  const data = CollectionDto.parse({
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

export async function clone(req, res) {
  const { id, name, description } = CollectionDto.parse(
    { ...req.body, id: Number(req.body?.id) },
  );

  await db.execute(sql`
            START TRANSACTION;

            CREATE TEMP TABLE languages_tmp_map (old_id INT, new_id INT);

            WITH new_collection AS
            (
                INSERT INTO collections (name, description) VALUES (
                    ${name},
                    ${description}
                ) 
                RETURNING id AS new_collection_id
            ), languages_map AS 
            (
                INSERT INTO languages (collection_id, name, code)
                SELECT new_collection.new_collection_id AS collection_id, languages.name AS name, languages.code AS code 
                FROM languages
                CROSS JOIN new_collection
                WHERE languages.collection_id = ${id}
                RETURNING id, code
            ) 
            INSERT INTO languages_tmp_map (old_id, new_id)
                SELECT old_languages.id AS old_id, new_languages.id AS new_id
                FROM languages AS old_languages
                INNER JOIN languages_map AS new_languages ON old_languages.code = new_languages.code
                WHERE old_languages.collection_id = 2;

            INSERT INTO translations (language_id, key, translation)
            SELECT new_id AS language_id, key, translation FROM translations
            INNER JOIN languages_tmp_map ON languages_tmp_map.old_id = translations.language_id;


            COMMIT;`);

  return res.send({ message: "ok" });
}
