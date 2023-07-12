import { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { UserCreateBodySchema } from "../user/user.utils";

import { Prisma } from "@prisma/client";
import express from "express";
import { ICbDatabase } from "../../utils/database";

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
   ** Signup endpoint
   */
  accessRouter.post(
    "/signup",
    catchErrors(async (req: Request, res: Response) => {
      const parsedUser = UserCreateBodySchema.parse(req.body);
      const user = await db.createUser(parsedUser);
      const contextUserId = await db.setUserContext(
        user.system_user_id,
        user.system_name
      );
      return res.status(201).json({ user_id: contextUserId }).end();
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
