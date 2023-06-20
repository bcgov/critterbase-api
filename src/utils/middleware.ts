import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { loginUser } from "../api/access/access.service";
import { AuthHeadersSchema } from "../api/user/user.utils";
import { IS_TEST, NO_AUTH } from "./constants";
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
  err: apiError | ZodError | Error | PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!IS_TEST) {
    console.error(
      `🛑 ${req.method} ${req.originalUrl} -> ${err.toString()} -- ${
        err.stack ?? "No stack"
      }`
    );
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
    const fieldKeys = Object.keys(fieldErrors);
    const customErrs: Record<string, string> = {};
    //Bulk router can throw a custom formatted error.
    //Splitting them apart to better structure the error response
    err.errors.forEach((e) => {
      const t = e.message.split("~");
      if (t.length === 2) {
        customErrs[t[0]] = t[1];
      }
    });
    if (!fieldKeys.length) {
      return res.status(400).json({ error: err.format()._errors.join(", ") });
    }
    return res.status(400).json({
      errors: Object.keys(customErrs).length ? customErrs : fieldErrors,
    });
  }
  if (err instanceof apiError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof PrismaClientKnownRequestError) {
    const { status, error } = prismaErrorMsg(err);
    return res.status(status).json({ error });
  }
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message || "unknown error" });
  }
  next(err);
};

const auth = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    if (IS_TEST || NO_AUTH) return next();
    const headers = AuthHeadersSchema.parse(req.headers);
    await loginUser({
      user_id: headers["user-id"],
      keycloak_uuid: headers["keycloak-uuid"],
    });
    next();
  }
);

export { errorLogger, errorHandler, catchErrors, auth };
