import { integer, jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { collections } from "./collections.ts";

export const translations = pgTable("translations", {
  id: serial().primaryKey().notNull(),
  collectionId: integer("collection_id").notNull(),
  key: text("key").notNull(),
  translations: jsonb().notNull(),
});

export const translationsRelations = relations(translations, ({ one }) => ({
  collections: one(collections, {
    fields: [translations.collectionId],
    references: [collections.id],
  }),
}));
