import { drizzle } from "drizzle-orm/node-postgres";

import { load } from "std/dotenv";

import pg from "pg";
import { enforceEnvironmentVariables } from "@/server/utils/envVariables.js";

const { Pool } = pg;

await load({ export: true });

enforceEnvironmentVariables([
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
]);

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
