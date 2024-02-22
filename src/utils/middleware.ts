import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { loginUser } from "../api/access/access.service";
import { AuthLoginSchema } from "../api/user/user.utils";
import { IS_TEST, NO_AUTH } from "./constants";
import { prismaErrorMsg } from "./helper_functions";
import { apiError } from "./types";
import { authenticateRequest } from "../authentication/auth";
import { setUserContext } from "../api/user/user.service";

type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response> | Promise<void>;

/**
 * Catches errors on API routes. Used instead of wrapping try / catch on every endpoint.
 *
 * @param {ExpressHandler} fn - Express Handler callback.
 */
const catchErrors =
  (fn: ExpressHandler) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

/**
 * Middleware: Logs the incoming requests.
 *
 * @param {Request} req - Express Request.
 * @param {Response} _res - Express Response.
 * @param {NextFunction} next - Express Next callback.
 */
const logger = (req: Request, _res: Response, next: NextFunction) => {
  if (!IS_TEST) {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
};

/**
 * Middleware: Logs server errors.
 *
 * @param {apiError | ZodError | Error | PrismaClientKnownRequestError} err - [TODO:description]
 * @param {Request} req - Express Request.
 * @param {Response} _res - Express Response.
 * @param {NextFunction} next - Express Next callback.
 */
const errorLogger = (
  err: apiError | ZodError | Error | PrismaClientKnownRequestError,
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!IS_TEST) {
    console.error({ method: req.method, url: req.originalUrl, error: err });
  }

  next(err);
};

/**
 * Middleware: Generic express error handler. Will handle any errors catchErrors catches.
 *
 * @param {apiError | ZodError | Error | PrismaClientKnownRequestError} err - supported errors.
 * @param {Request} _req - Express Request.
 * @param {Response} res - Express Response.
 * @param {NextFunction} next - Express Next callback.
 * @returns {Response} Express Response.
 */
const errorHandler = (
  err: apiError | ZodError | Error | PrismaClientKnownRequestError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err });
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

/**
 * Middleware: Authorization.
 * Authorizes a user into Critterbase and sets the user context in DB.
 *
 * Note: Will bypass auth if NODE_ENV=TEST or AUTHENTICATE=NO_AUTH useful for development.
 *
 * @async
 * @returns {Promise<void>}
 */
const auth = catchErrors(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (IS_TEST || NO_AUTH) {
      return next();
    }
    const kc = await authenticateRequest(req);
    const parsed = AuthLoginSchema.parse({
      keycloak_uuid: kc.keycloak_uuid,
      system_name: kc.system_name,
    });
    await loginUser(parsed);
    console.log(JSON.stringify(kc));
    await setUserContext(kc.keycloak_uuid, kc.system_name);
    next();
  },
);

export { auth, catchErrors, errorHandler, errorLogger, logger };
