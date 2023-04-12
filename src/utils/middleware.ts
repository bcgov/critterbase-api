import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { API_KEY, API_KEY_HEADER, IS_DEV, IS_TEST } from "./constants";
import { prismaErrorMsg } from "./helper_functions";
import { apiError } from "./types";

/**
 * * Catches errors on API routes. Used instead of wrapping try/catch on every endpoint
 * @param fn function that accepts express params
 */
type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response> | Promise<void>;

const catchErrors =
  (fn: ExpressHandler) => (req: Request, res: Response, next: NextFunction) => {
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
  if (!IS_TEST) {
    console.error(`🛑 ${req.method} ${req.originalUrl} -> ${err.toString()}`);
  }

  next(err);
};

/**
 * * Generic express error handler. Will handle any errors catchErrors catches
 * @params All four express params.
 */
const errorHandler = (
  err: apiError | ZodError | Error | PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    //Removed formErrors from object
    const fieldErrors = err.flatten().fieldErrors;
    // const formErrors = err.flatten().formErrors;
    if (!Object.keys(fieldErrors).length) {
      return res.status(400).json({ error: err.format()._errors.join(", ") });
    }
    return res.status(400).json({ errors: fieldErrors });
  }
  if (err instanceof apiError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof PrismaClientKnownRequestError) {
    const { status, error } = prismaErrorMsg(err);
    return res.status(status).json({ error });
  }
  if (err instanceof Error) {
    return res.status(400).json(err.message || "unknown error");
  }
  next(err);
};

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user || IS_TEST || IS_DEV) {
    next();
  } else {
    next(
      new apiError("Must be logged in to access this route. POST api/login")
    );
  }
};

const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  if (IS_DEV || IS_TEST) {
    return next();
  }
  const apiKey = req.get(API_KEY_HEADER);
  if (!apiKey) {
    throw new apiError(`Header: '${API_KEY_HEADER}' must be provided`);
  }
  if (apiKey !== API_KEY) {
    throw new apiError(`Header: '${API_KEY_HEADER}' is incorrect`);
  }
  next();
};

export { errorLogger, errorHandler, catchErrors, auth, validateApiKey };
