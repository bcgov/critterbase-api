import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError
} from '@prisma/client/runtime/library';
import type { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { AuthService } from '../services/auth-service';
import { TokenService } from '../services/token-service';
import { UserService } from '../services/user-service';
import { BYPASS_AUTHENTICATION, IS_PROD, IS_TEST, KEYCLOAK_ISSUER, KEYCLOAK_URL } from './constants';
import { prismaErrorMsg } from './helper_functions';
import { apiError } from './types';

/**
 * Token Service
 *
 * @description Verifies jwt token against issuer.
 */
const tokenService = new TokenService({ tokenURI: KEYCLOAK_URL, tokenIssuer: KEYCLOAK_ISSUER });

/**
 * Auth Service
 *
 * @description Handles authentication and authorization.
 */
const authService = new AuthService(tokenService, UserService.init());

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
 * Middleware: Auth (Authentication and Authorization).
 * Authenticates and authorizes a user into Critterbase.
 *
 * Note: Auth middleware is bypassed if NODE_ENV=TEST or AUTHENTICATE=FALSE.
 *
 * @async
 * @returns {void}
 */
const auth = catchErrors(async (req: Request, _res: Response, next: NextFunction) => {
  // If running test suite or authentication disabled: skip
  if (BYPASS_AUTHENTICATION) {
    return next();
  }

  // Authenticate the request: Verify token, user and audience from headers
  const authenticatedUser = await authService.authenticate(req.headers);

  // Authorize user: Login user and set database context for auditing
  await authService.authorize(authenticatedUser);

  next();
});

/**
 * Middleware: Rate Limiter (`Denial of Service` attack prevention)
 * Limits subsequent requests within a set timeframe.
 *
 * Note: Currently these values are hard coded, if more tweaking is needed
 * put these values into the ENV.
 *
 */
const limiter = rateLimit({
  // 5 minutes in milliseconds,
  windowMs: 10 * 60 * 1000,

  // Request limit for `windowMs`
  limit: 50,

  /**
   * Generates the rate limit key used to identify requests from same user or service.
   *
   * Note: Using IP and user header to prevent unessescary limiting of external service accounts.
   *
   * @param {Request} req - Express request
   * @returns {string} Rate limit key
   */
  keyGenerator: (req): string => `${req.ip}-${String(req.headers['user'])}`,

  /**
   * Skip rate limiting if not 'production'.
   *
   */
  skip: (): boolean => !IS_PROD
});

export { auth, catchErrors, errorHandler, errorLogger, limiter, logger };
