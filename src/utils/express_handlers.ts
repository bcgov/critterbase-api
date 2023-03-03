import type { Request, Response, NextFunction } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { app } from "../server";
import { IS_DEV, IS_PROD, IS_TEST, PORT } from "./constants";
import { cError } from "./global_types";

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
  err: Error | cError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`${req.originalUrl} error: ${err.message}`);
  next(err);
};

/**
 * * Generic express error handler. Will handle any errors catchErrors catches
 * @params All four express params.
 */
const errorHandler = (
  err: Error | cError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof cError) {
    return res.status(err.status).json({ error: err.message });
  } else {
    return res
      .status(400)
      .json({ error: err.message || "Unknown error occurred" });
  }
};

/**
 ** Logs basic details about the current supported routes
 * @params All four express params.
 */
const home = (req: Request, res: Response, next: NextFunction) => {
  return res.json([
    "Welcome to Critterbase API",
    "Temp details before swagger integration",
    {
      routes: [
        {
          "api/critters": {
            "/": ["get"],
            "/new": ["post"],
            "/:id": ["get", "put", "delete"],
          },
        },
      ],
    },
  ]);
};

const stripAuditFields = (req: Request, res: Response, next: NextFunction) => {
  console.log("called");
  console.log(res);
  next();
};

export { errorLogger, errorHandler, catchErrors, home, stripAuditFields };
