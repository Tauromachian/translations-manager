import { drizzle } from "npm:drizzle-orm/node-postgres";

import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import pg from "pg";

const { Pool } = pg;

await load({ export: true });

const postgresUrl = `postgresql://${Deno.env.get("DB_USER")}:${
  Deno.env.get("DB_PASSWORD")
}@${Deno.env.get("DB_HOST")}:${Deno.env.get("DB_PORT")}/${
  Deno.env.get("DB_NAME")
}`;

const pool = new Pool({
  connectionString: postgresUrl,
});

export const db = drizzle({
  client: pool,
});
