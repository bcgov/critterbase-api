import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError
} from '@prisma/client/runtime/library';
import type { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { TokenService } from '../services/token-service';
import { UserService } from '../services/user-service';
import { getAllowList, getAuthToken, getAuthTokenAudience, getAuthUser } from './auth';
import { BYPASS_AUTHENTICATION, IS_TEST, KEYCLOAK_ISSUER, KEYCLOAK_URL } from './constants';
import { prismaErrorMsg } from './helper_functions';
import { apiError } from './types';

/**
 * User Service
 *
 * @description Handles logging in users
 */
const userService = UserService.init();

/**
 * Token Service
 *
 * @description Verifies jwt token against issuer.
 */
const tokenService = new TokenService({ tokenURI: KEYCLOAK_URL, tokenIssuer: KEYCLOAK_ISSUER });

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
   *
   * @description Incorrect request body or params
   *
   */
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Zod validation failed.', issues: err.issues });
  }
  /**
   * ApiError
   *
   * @description Manually thrown errors from repository / service methods
   */
  if (err instanceof apiError) {
    return res.status(err.status).json({ error: err.message, issues: err.errors });
  }
  /**
   * Known prisma errors
   *
   * @description Database constraint failed
   *
   */
  if (err instanceof PrismaClientKnownRequestError) {
    const { status, error } = prismaErrorMsg(err);
    return res.status(status).json({ error, issues: [err.meta] });
  }
  /**
   * Prisma Validation Errors
   *
   * @description Incorrect raw prisma query syntax
   */
  if (err instanceof PrismaClientValidationError) {
    return res.status(500).json({ error: 'Database query syntax error', issues: ['View logs'] });
  }
  /**
   * Prisma Unknown Errors
   *
   * @description Usually custom database constraint failed
   */
  if (err instanceof PrismaClientUnknownRequestError) {
    return res.status(500).json({ error: 'Database query failed.', issues: ['View logs'] });
  }
  /**
   * Expired token errors.
   *
   * @description JWT token has expired
   */
  if (err instanceof TokenExpiredError) {
    return res.status(500).json({ error: 'JWT bearer token has expired' });
  }
  /**
   * Error
   *
   * @description Fallback for all other types of errors
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
  try {
    // 1. If running test suite or authentication is disabled: skip
    if (BYPASS_AUTHENTICATION) {
      return next();
    }

    // 2. Get the auth token and user from the request headers
    const authToken = getAuthToken(req.headers); // authorization 'Bearer xxx.yyy.zzz'
    const authUser = getAuthUser(req.headers); // user '{"keycloak_guid": "xxx", "user_identifier": "yyy"}'

    // 3. Verify the token against the issuer
    const verifiedToken = await tokenService.getVerifiedToken<JwtPayload>(authToken);

    // 4. Get the token audience (system name)
    const audience = getAuthTokenAudience(verifiedToken);

    // 5. Check if the token audience is allowed
    const audienceNotAllowed = !getAllowList().includes(audience);

    if (audienceNotAllowed) {
      throw new apiError('Token audience not allowed.');
    }

    // 6. Authorize user: Login user and set database context for auditing
    await userService.loginUser({
      keycloak_uuid: authUser.keycloak_uuid,
      user_identifier: authUser.user_identifier,
      system_name: audience
    });
  } catch (error) {
    throw apiError.forbidden(`Access Denied: ${(error as apiError).message}`, [error]);
  }

  next();
});

/**
 * Middleware: Rate Limiter
 *
 * Note: This will bypass rate limiting for tests and allowed audiences.
 *
 * @description Limits the number of requests per IP.
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  skip: (req: Request) => {
    // Skip rate limiting for tests
    if (IS_TEST) {
      return true;
    }
    // Decode the token (unverified)
    const token = tokenService.getDecodedToken(getAuthToken(req.headers));
    // Get the token audience
    const audience = getAuthTokenAudience(token.payload as JwtPayload);

    // Skip rate limiting for allowed audiences
    return getAllowList().includes(audience);
  }
});

export { auth, catchErrors, errorHandler, errorLogger, logger };
