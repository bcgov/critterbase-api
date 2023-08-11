import { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { UserCreateBodySchema } from "../user/user.utils";

import { Prisma } from "@prisma/client";
import express from "express";
import { ICbDatabase } from "../../utils/database";
import { authenticateRequest } from "../../authentication/auth";

export const AccessRouter = (db: ICbDatabase) => {
  const accessRouter = express.Router();

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
  /*accessRouter.post(
    "/login",
    catchErrors(async (req: Request, res: Response) => {
      const parsedLogin = AuthLoginSchema.parse(req.body);
      const user = await db.loginUser(parsedLogin);
      const contextUserId = await db.setUserContext(
        user.system_user_id,
        user.system_name
      );
      return res.status(200).json({ user_id: contextUserId }).end();
    })
  );*/

  /**
   ** Signup endpoint
   */
  accessRouter.post(
    "/signup",
    catchErrors(async (req: Request, res: Response) => {
      const kc = await authenticateRequest(req);
      const parsedUser = UserCreateBodySchema.parse({user_identifier: kc.identifier, keycloak_uuid: kc.keycloak_uuid});
      await db.createUser(parsedUser);
      const contextUserId = await db.setUserContext(
        kc.keycloak_uuid,
        kc.system_name
      );
      return res.status(201).json({user_id: contextUserId}).end();
    })
  );

  accessRouter.get(
    "/types/:model",
    catchErrors(async (req: Request, res: Response) => {
      const types = await db.getTableDataTypes(
        req.params.model as Prisma.ModelName
      );
      return res.status(200).json(types);
    })
  );

  return accessRouter;
};
