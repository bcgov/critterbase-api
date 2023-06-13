import { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { createUser, setUserContext } from "../user/user.service";
import { UserCreateBodySchema } from "../user/user.utils";

import { Prisma } from "@prisma/client";
import express from "express";
import { getTableDataTypes } from "./access.service";

export const accessRouter = express.Router();

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
    const user = await createUser(parsedUser);
    await setUserContext(user.system_user_id, user.system_name);
    return res.status(201).json({user_id: user.user_id}).end();
  })
);

accessRouter.get(
  "/types/:model",
  catchErrors(async (req: Request, res: Response) => {
    const types = await getTableDataTypes(req.params.model as Prisma.ModelName);
    return res.status(200).json(types);
  })
);
