import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { collections } from "./collections.ts";

export const languages = pgTable("languages", {
  id: serial().primaryKey().notNull(),
  collectionId: integer("collection_id").references(() => collections.id, {
    onDelete: "cascade",
  }),
  name: text().notNull(),
  code: text().notNull(),
});

export const languagesRelations = relations(languages, ({ one }) => ({
  collections: one(collections, {
    fields: [languages.collectionId],
    references: [collections.id],
  }),
}));
