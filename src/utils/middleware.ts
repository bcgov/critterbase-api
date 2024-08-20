import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError
} from '@prisma/client/runtime/library';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { loginUser } from '../api/access/access.service';
import { setUserContext } from '../api/user/user.service';
import { authenticateRequest } from '../authentication/auth';
import { IS_TEST, NO_AUTH } from './constants';
import { prismaErrorMsg } from './helper_functions';
import { apiError } from './types';

/**
 * Express request handler callback
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<Response>}
 */
type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response> | Promise<void>;

/**
 * Catches errors on API routes. Used instead of wrapping try / catch on every endpoint.
 *
 * @param {ExpressHandler} fn - Express Handler callback.
 */
const catchErrors = (fn: ExpressHandler) => (req: Request, res: Response, next: NextFunction) => {
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
  next: NextFunction
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
  next: NextFunction
) => {
  /**
   * Zod validation errors
   * @description Incorrect request body or params
   *
   */
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Zod validation failed.', issues: err.issues });
  }
  /**
   * ApiError
   * @description Manually thrown errors from repository / service methods
   */
  if (err instanceof apiError) {
    return res.status(err.status).json({ error: err.message, issues: err.errors });
  }
  /**
   * Known prisma errors
   * @description Database constraint failed
   *
   */
  if (err instanceof PrismaClientKnownRequestError) {
    const { status, error } = prismaErrorMsg(err);
    return res.status(status).json({ error, issues: [err.meta] });
  }
  /**
   * Prisma Validation Errors
   * @description Incorrect raw prisma query syntax
   *
   */
  if (err instanceof PrismaClientValidationError) {
    return res.status(500).json({ error: 'Database query syntax error', issues: ['View logs'] });
  }
  /**
   * Prisma Unknown Errors
   * @description Usually custom database constraint failed
   *
   */
  if (err instanceof PrismaClientUnknownRequestError) {
    return res.status(500).json({ error: 'Database query failed.', issues: ['View logs'] });
  }
  /**
   * Error
   * @description Fallback for all other types of errors
   *
   */
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message || 'Unknown error' });
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
const auth = catchErrors(async (req: Request, _res: Response, next: NextFunction) => {
  /**
   * Bypass if NODE_ENV is `TEST` or AUTHETICATE is 'FALSE'
   */
  if (IS_TEST || NO_AUTH) {
    return next();
  }
  /**
   * Authenticate the incomming request via Bearer token
   */
  const kc = await authenticateRequest(req);
  /**
   * Login the user to critterbase
   * Note: User needs to already exist
   *
   */
  const user = await loginUser({ keycloak_uuid: kc.keycloak_uuid });
  /**
   * Set the user context in the database
   * Note: This populates the audit columns for all subsequent requests
   *
   */
  await setUserContext(kc.keycloak_uuid, kc.system_name);
  /**
   * Log the important user details
   *
   */
  console.log(
    JSON.stringify({
      user_identifier: user.user_identifier,
      keycloak_uuid: user?.keycloak_uuid,
      user_id: user.user_id
    })
  );
  /**
   * Pass the request to the next request handler
   *
   */
  next();
});

export { auth, catchErrors, errorHandler, errorLogger, logger };
