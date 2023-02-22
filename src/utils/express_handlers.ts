import type { Request, Response, NextFunction } from "express";

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
  err: Error,
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
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ error: err?.message ?? "Some error occurred..." });
};

const root = (req: Request, res: Response, next: NextFunction) => {
  return res.json("Welcome to Critterbase API");
};

export { errorLogger, errorHandler, catchErrors, root };
