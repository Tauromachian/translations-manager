import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { languages } from "./languages.ts";

export const translations = pgTable("translations", {
  id: serial().primaryKey().notNull(),
  languageId: integer("language_id").references(() => languages.id, {
    onDelete: "cascade",
  }).notNull(),
  key: text("key").notNull(),
  translation: text(),
});

export const translationsRelations = relations(translations, ({ one }) => ({
  languages: one(languages, {
    fields: [translations.languageId],
    references: [languages.id],
  }),
}));
