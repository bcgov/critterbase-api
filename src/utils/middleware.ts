import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { API_KEY, API_KEY_HEADER, IS_DEV, IS_TEST, NO_AUTH } from "./constants";
import { prismaErrorMsg } from "./helper_functions";
import { apiError } from "./types";
import cookieParser from "cookie-parser";
import { AuthLoginSchema } from "../api/user/user.utils";
import { loginUser } from "../api/access/access.service";

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
    return res.status(400).json(err.message || "unknown error");
  }
  next(err);
};

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (IS_TEST || NO_AUTH) {
    next();
  }
  const parsedLogin = AuthLoginSchema.parse({
    user_id: req.headers.user_id,
    keycloak_uuid: req.headers.keycloak_uuid,
  });
  const user = await loginUser(parsedLogin);
  if (user) {
    next();
  } else {
    console.log("err placeholder");
    next(
      new apiError("Must provide a user_id and keycloak_uuid headers", 400)
    );
  }
};

const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  if (IS_DEV || IS_TEST || NO_AUTH) {
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
