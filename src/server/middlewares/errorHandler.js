import z from "zod";

import { getLogger } from "@logtape/logtape";

const logger = getLogger(["app"]);

function getMessageByCode(statusCode) {
  if (statusCode >= 500) return "Internal Server Error";
  if (statusCode == 404) return "Not Found";
  if (statusCode == 403) return "Forbidden";
  if (statusCode == 401) return "Unauthorized";
  if (statusCode == 400) return "Bad Request";

  return "Something went wrong";
}

export function errorHandler(err, req, res, _) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode);

  const prodErrorObject = {
    message: getMessageByCode(statusCode),
  };

  const devErrorObject = {
    message: err.message || getMessageByCode(statusCode),
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    user: req.user?.id || "unauthenticated",
    cause: err.cause ?? "",
  };
  if (err.stack) devErrorObject.stack = err.stack;

  if (statusCode === 400) {
    err = z.treeifyError(err);

    prodErrorObject.details = err;
    devErrorObject.details = err;
  }

  logger.error(devErrorObject);

  if (Deno.env.get("APP_ENV") === "development") {
    return res.json(devErrorObject);
  } else {
    return res.json(prodErrorObject);
  }
}
