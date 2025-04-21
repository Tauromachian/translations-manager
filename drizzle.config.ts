import { defineConfig } from "drizzle-kit";

import process from "node:process";

import dotenv from "dotenv";
dotenv.config();

const postgresUrl = `postgresql://
${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log(postgresUrl);

export default defineConfig({
  dialect: "postgresql",
  schema: "./database/schema",
  dbCredentials: {
    url: postgresUrl,
  },
});
