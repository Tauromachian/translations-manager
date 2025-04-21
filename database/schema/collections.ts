import { pgTable, serial, text } from "drizzle-orm/pg-core";

// Define the "collections" table (equivalent to your Collection entity)
export const collections = pgTable("collections", {
  id: serial().primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
});
