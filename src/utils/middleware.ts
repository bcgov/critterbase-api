import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { IS_TEST, NO_AUTH } from './constants';
import { prismaErrorMsg } from './helper_functions';
import { apiError } from './types';
import { authenticateRequest } from '../authentication/auth';
import { UserService } from '../services/user-service';

type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response> | Promise<void>;

/**
 * Catches errors on API routes.
 * Used instead of wrapping try / catch on every endpoint.
 *
 * @param {ExpressHandler} fn - Express Handler callback.
 */
const catchErrors = (fn: ExpressHandler) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res, next).catch(next);
};

/**
 * Middleware: Logs incomming requests.
 *
 * @param {Request} req - Express Request.
 * @param {Response} _res - Express Response.
 * @param {NextFunction} next - Express Next callback.
 * @returns {void}
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
 * @param {apiError | ZodError | Error | PrismaClientKnownRequestError} err
 * @param {Request} req - Express Request.
 * @param {Response} _res - Express Response.
 * @param {NextFunction} next - Express Next callback.
 */
const errorLogger = (
  err: apiError | ZodError | Error | PrismaClientKnownRequestError,
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!IS_TEST) {
    console.error({ method: req.method, url: req.originalUrl, error: err });
  }

  next(err);
};

/**
 * Middleware: Express error handler.
 * Handles any caught errors via `catchErrors`.
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
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Zod validation failed.', issues: err.issues });
  }
  if (err instanceof apiError) {
    return res.status(err.status).json({ error: err.message, issues: err.errors });
  }
  if (err instanceof PrismaClientKnownRequestError) {
    const { status, error } = prismaErrorMsg(err);
    return res.status(status).json({ error, issues: [err.meta] });
  }
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message || 'unknown error' });
  }
  next(err);
};

/**
 * Middleware: Authorization.
 * Authorizes a user into Critterbase and sets the user context in the DB.
 *
 * Note: Auth middleware is bypassed if NODE_ENV=TEST or AUTHENTICATE=FALSE.
 *
 * @async
 * @returns {void}
 */
const auth = catchErrors(async (req: Request, _res: Response, next: NextFunction) => {
  if (IS_TEST || NO_AUTH) {
    return next();
  }
  const userService = UserService.init();

  // Authenticate the request - parse token, audience and user details from headers
  const authUser = await authenticateRequest(req);

  // Login user and set database context for auditing
  await userService.loginUser(authUser);

  next();
});

export { auth, catchErrors, errorHandler, errorLogger, logger };
