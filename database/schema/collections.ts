import { customType, index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

import { translations } from "./translations.ts";
import { languages } from "./languages.ts";

const tsVector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const collections = pgTable("collections", {
  id: serial().primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  searchVector: tsVector("search_vector").generatedAlwaysAs(() =>
    sql`
        SELECT * 
          FROM collections 
          WHERE (setweight(to_tsvector(name), 'A') ||
                 setweight(coalesce(to_tsvector(description), ''), 'B') 
        `
  ),
}, (table) => [
  index("index_search_vector").using("gin", table.searchVector),
]);

export const collectionsRelations = relations(collections, ({ many }) => ({
  translations: many(translations),
  languages: many(languages),
}));
