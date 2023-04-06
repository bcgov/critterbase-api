import { user } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { createUser, setUserContext } from "../api/user/user.service";
import { AuthLoginSchema, UserCreateBodySchema } from "../api/user/user.utils";
import { API_KEY, API_KEY_HEADER, IS_DEV, IS_TEST, prisma } from "./constants";
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
  return res
    .status(200)
    .json({ healthStatus: "Healthy", session: req.session })
    .end();
};

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user || IS_TEST) {
    next();
  } else {
    next(
      new apiError(
        "Unauthorized Access. Login with valid user_id OR keycloak_uuid"
      )
    );
  }
};

const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  if (IS_DEV || IS_TEST) {
    next();
    return;
  }
  const apiKey = req.get(API_KEY_HEADER);
  if (!apiKey) {
    throw new apiError(`Header: 'API-KEY' must be provided`);
  }
  if (apiKey !== API_KEY) {
    throw new apiError(`Header: 'API-KEY' is incorrect`);
  }
  next();
};

const login = catchErrors(async (req: Request, res: Response) => {
  if (req.session.user) {
    return res.status(200).json({ user_id: req.session.user.user_id }).end();
  }
  // Allows login via critterbase user_id or keycloak_uuid
  const { user_id, keycloak_uuid } = AuthLoginSchema.parse(req.body);
  const user = await prisma.user.findFirst({
    where: { OR: [{ user_id, keycloak_uuid }] },
  });
  // This might be the step to redirect to the signup
  if (!user) throw apiError.notFound("No user found. Login failed.");
  //Sets the context in the DB, populates audit columns with user_id
  const contextUserId = await setUserContext(
    user.system_user_id,
    user.system_name
  );
  req.session.user = user;
  return res.status(200).json({ user_id: contextUserId }).end();
});

const signUp = catchErrors(async (req: Request, res: Response) => {
  const parsedUser = UserCreateBodySchema.parse(req.body);
  const user = await createUser(parsedUser);
  const contextUserId = await setUserContext(
    user.system_user_id,
    user.system_name
  );
  req.session.user = user;
  return res.status(201).json({ user_id: contextUserId }).end();
});

export {
  errorLogger,
  errorHandler,
  catchErrors,
  home,
  health,
  login,
  auth,
  signUp,
  validateApiKey,
};
