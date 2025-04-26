import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { translations } from "./translations.ts";

export const collections = pgTable("collections", {
  id: serial().primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  translations: many(translations),
}));
