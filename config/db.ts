import { drizzle } from "npm:drizzle-orm/node-postgres";

import Pool from "npm:pg-pool";

const postgresUrl = `postgresql://
    ${Deno.env.get("DATABASE_USER")}:${Deno.env.get("DATABASE_PASSWORD")}@${
  Deno.env.get("DATABASE_HOST")
}:${Deno.env.get("DATABASE_PORT")}/${Deno.env.get("DATABASE_NAME")}`;

const pool = new Pool({
  connectionString: postgresUrl,
});

export const db = drizzle({
  client: pool,
});
