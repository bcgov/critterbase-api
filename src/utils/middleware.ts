import type { Request, Response, NextFunction } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { app } from "../server";
import { IS_DEV, IS_PROD, IS_TEST, PORT } from "./constants";
import { exclude } from "./helper_functions";
import { apiError, uuid } from "./types";

/**
 * * Catches errors on API routes. Used instead of wrapping try/catch on every endpoint
 * @param fn function that accepts express params
 */
const catchErrors =
  (fn: (req: Request, res: Response, next: NextFunction) => any) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

/**
 * * Logs the errors in the express server. Displays issue endpoint
 * @params All four express params.
 */
const errorLogger = (
  err: apiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(
    `🛑 ${req.method}${" " + err?.status} ${
      req.originalUrl
    } -> ${err.toString()}`
  );
  next(err);
};

/**
 * * Generic express error handler. Will handle any errors catchErrors catches
 * @params All four express params.
 */
const errorHandler = (
  err: apiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof apiError) {
    return res.status(err.status).json({ error: err.message });
  }
  next(err);
  // else {
  //   return res
  //     .status(400)
  //     .json({ error: err.message || "Unknown error occurred" });
  // }
};

/**
 ** Logs basic details about the current supported routes
 * @params All four express params.
 */
const home = (req: Request, res: Response, next: NextFunction) => {
  return res.json([
    "Welcome to Critterbase API",
    "Temp details before swagger integration",
  ]);
};

const excludeAuditFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ("audit" in req.query) {
    console.log("keeping audit cols");
    next();
  }

  const oldSend = res.send;
  res.send = function (data) {
    console.log("excluding audit cols");
    exclude(data);
    res.send = oldSend;
    return res.send(data);
  };
  next();
};

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateUuidParam = (req: Request): string => {
  if (!("id" in req.params)) {
    throw apiError.requiredProperty("user_id");
  }
  const id = req.params.id;
  if (!uuidRegex.test(id)) {
    throw apiError.syntaxIssue("Invalid ID Parameter");
  }
  return id;
};

export {
  errorLogger,
  errorHandler,
  catchErrors,
  home,
  excludeAuditFields,
  validateUuidParam,
  uuidRegex,
};
