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
      `🛑 ${req.method} ${req.originalUrl} -> ${JSON.stringify(err)} -- ${
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
    // const headers = AuthHeadersSchema.parse(req.headers);
    // // validate api key
    // if (headers[API_KEY_HEADER] != API_KEY) {
    //   throw new apiError("Invalid API key", 401);
    // }
    // await loginUser({
    //   user_id: headers["user-id"],
    //   keycloak_uuid: headers["keycloak-uuid"],
    // });
    const kc = await authenticateRequest(req);
    const parsed = AuthLoginSchema.parse({keycloak_uuid: kc.keycloak_uuid, system_name: kc.system_name});
    await loginUser(parsed);
    console.log(JSON.stringify(kc));
    await setUserContext(kc.keycloak_uuid, kc.system_name);
    next();
  }
);

export { auth, catchErrors, errorHandler, errorLogger };
