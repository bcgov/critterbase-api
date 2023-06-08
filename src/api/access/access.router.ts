import { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { createUser, setUserContext } from "../user/user.service";
import { AuthLoginSchema, UserCreateBodySchema } from "../user/user.utils";

import { Prisma } from "@prisma/client";
import express from "express";
import { getTableDataTypes, loginUser } from "./access.service";

export const accessRouter = express.Router();

/**
 ** Logs basic details about the current supported routes
 * @params All four express params.
 */
accessRouter.get("/", (req: Request, res: Response) => {
  return res.status(200).json("Welcome to Critterbase API");
});
/**
 ** login endpoint
 * Note: currently accepts, user_id OR keycloak_uuid OR (system_name AND system_user_id)
 */
accessRouter.post(
  "/login",
  catchErrors(async (req: Request, res: Response) => {
    const parsedLogin = AuthLoginSchema.parse(req.body);
    const user = await loginUser(parsedLogin);
    req.session.user = user;
    return res.status(200).json({ "critterbase.sid": req.sessionID }).end();
  })
);

/**
 ** Signup endpoint
 */
accessRouter.post(
  "/signup",
  catchErrors(async (req: Request, res: Response) => {
    const parsedUser = UserCreateBodySchema.parse(req.body);
    const user = await createUser(parsedUser);
    await setUserContext(user.system_user_id, user.system_name);
    req.session.user = user;
    return res.status(201).json({ "critterbase.sid": req.sessionID }).end();
  })
);

accessRouter.get(
  "/types/:model",
  catchErrors(async (req: Request, res: Response) => {
    const types = await getTableDataTypes(req.params.model as Prisma.ModelName);
    return res.status(200).json(types);
  })
);
