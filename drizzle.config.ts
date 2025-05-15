import { defineConfig } from "drizzle-kit";

import process from "node:process";

import dotenv from "dotenv";
dotenv.config();

const postgresUrl = `postgresql://
${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export default defineConfig({
  dialect: "postgresql",
  schema: "./database/schema/*",
  out: "./database/drizzle",
  dbCredentials: {
    url: postgresUrl,
  },
});
