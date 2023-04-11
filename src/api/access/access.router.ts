import { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { createUser, setUserContext } from "../user/user.service";
import { AuthLoginSchema, UserCreateBodySchema } from "../user/user.utils";

import express from "express";
import { loginUser } from "./access.service";

export const accessRouter = express.Router();

/**
 ** Logs basic details about the current supported routes
 * @params All four express params.
 */
accessRouter.get("/", (req: Request, res: Response) => {
  return res.status(200).json("Welcome to Critterbase API");
});

accessRouter.post(
  "/login",
  catchErrors(async (req: Request, res: Response) => {
    const parsedLogin = AuthLoginSchema.parse(req.body);
    const user = await loginUser(parsedLogin);
    req.session.user = user;
    return res.status(200).json({ user_id: user.user_id }).end();
  })
);

accessRouter.post(
  "/signup",
  catchErrors(async (req: Request, res: Response) => {
    const parsedUser = UserCreateBodySchema.parse(req.body);
    const user = await createUser(parsedUser);
    const contextUserId = await setUserContext(
      user.system_user_id,
      user.system_name
    );
    req.session.user = user;
    return res.status(201).json({ user_id: contextUserId }).end();
  })
);
