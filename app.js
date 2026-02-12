import express from "express";

import { load } from "std/dotenv";

import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { start as livereloadStart } from "./config/livereload.ts";
import swaggerSpec from "./config/swagger.ts";

import "./config/logger.ts";

import { router as siteRouter } from "./routes/site.js";
import { router as appRouter } from "./routes/app.js";
import { router as apiRouter } from "./routes/api.js";
import { errorHandler } from "@/server/middlewares/errorHandler.js";
import { rateLimiter } from "@/server/middlewares/rateLimiter.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(Deno.cwd() + "/public"));

app.set("query parser", "extended");

app.use("/", siteRouter);
app.use("/app", appRouter);
app.use("/api", apiRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(rateLimiter);

app.use((_, _1, next) => {
  next({ statusCode: 404 });
});

app.use(errorHandler);

(
  async function init() {
    await load({ export: true });

    app.listen(3000, () => console.log("Server on http://localhost:3000"));

    if (Deno.env.get("APP_ENV") === "development") {
      livereloadStart();
    }
  }
)();
