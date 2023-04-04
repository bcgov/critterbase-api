import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import { IS_TEST } from "./constants";
import { prismaErrorMsg } from "./helper_functions";
import { apiError } from "./types";
import { zodID } from "./zod_helpers";
import { getUser } from "../api/user/user.service";

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

/**
 ** Logs basic details about the current supported routes
 * @params All four express params.
 */
const home = (req: Request, res: Response) => {
  return res.json([
    "Welcome to Critterbase API",
    "Temp details before swagger integration",
  ]);
};

const health = (req: Request, res: Response) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  res.status(200).json({ healthStatus: "Healthy", session: req.session });
  res.end();
};

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user_id) {
    next();
  } else {
    next(new apiError("Unauthorized Access. Login with valid user_id"));
  }
};

const login = catchErrors(async (req: Request, res: Response) => {
  if (req.session.user_id) {
    return res.status(200).json("Already logged in").end();
  }
  const { user_id } = z.object({ user_id: zodID }).strict().parse(req.body);
  await getUser(user_id);
  req.session.user_id = user_id;
  return res.status(200).json("Logged in to Critterbase API").end();
});

export { errorLogger, errorHandler, catchErrors, home, health, login, auth };
