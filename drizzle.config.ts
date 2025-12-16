import { defineConfig } from "drizzle-kit";

const postgresUrl = `postgresql://
${Deno.env.get("DB_USER")}:${Deno.env.get("DB_PASSWORD")}@${
  Deno.env.get("DB_HOST")
}:${Deno.env.get("DB_PORT")}/${Deno.env.get("DB_NAME")}`;

export default defineConfig({
  dialect: "postgresql",
  schema: "./database/schema/*",
  out: "./database/drizzle",
  dbCredentials: {
    url: postgresUrl,
  },
});
