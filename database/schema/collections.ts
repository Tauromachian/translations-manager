import { integer, pgTable, text } from "drizzle-orm/pg-core";

// Define the "collections" table (equivalent to your Collection entity)
export const collections = pgTable("collections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
});
