import { configure, getConsoleSink } from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";
import { jsonLinesFormatter } from "@logtape/logtape";

const isDevelopment = Deno.env.get("NODE_ENV") === "development";

await configure({
  sinks: {
    console: getConsoleSink({
      formatter: isDevelopment ? prettyFormatter : jsonLinesFormatter,
    }),
  },
  loggers: [
    { category: "app", lowestLevel: "debug", sinks: ["console"] },
  ],
});
