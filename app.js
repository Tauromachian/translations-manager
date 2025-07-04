import express from "npm:express@5";
import morgan from "npm:morgan";

import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import { rateLimit } from "npm:express-rate-limit";

import swaggerUi from "npm:swagger-ui-express";

import { start as livereloadStart } from "./config/livereload.ts";
import swaggerSpec from "./config/swagger.ts";

import { router as siteRouter } from "./routes/site.js";
import { router as appRouter } from "./routes/app.js";
import { router as apiRouter } from "./routes/api.js";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(Deno.cwd() + "/public"));

app.set("query parser", "extended");

app.use("/", siteRouter);
app.use("/app", appRouter);
app.use("/api", apiRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(limiter);

(
  async function init() {
    await load({ export: true });

    app.listen(3000, () => console.log("Server on http://localhost:3000"));

    if (Deno.env.get("APP_ENV") === "dev") {
      livereloadStart();
    }
  }
)();
