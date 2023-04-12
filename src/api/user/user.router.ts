import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  upsertUser,
} from "./user.service";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import { UserCreateBodySchema, UserUpdateBodySchema } from "./user.utils";

export const userRouter = express.Router();

/**
 ** User Router Home
 */
userRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(200).json(await getUsers());
  })
);

/**
 ** Create new user
 */
userRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const userData = UserCreateBodySchema.parse(req.body);
    const newUser = await upsertUser(userData);
    return res.status(201).json(newUser);
  })
);

/**
 ** All user_id related routes
 */
userRouter
  .route("/:id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      // validate uuid
      await uuidParamsSchema.parseAsync(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      return res.status(200).json(await getUser(req.params.id));
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const userData = UserUpdateBodySchema.parse(req.body);
      const user = await updateUser(req.params.id, userData);
      return res.status(200).json(user);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const deleted = await deleteUser(id);
      return res.status(200).json(deleted);
    })
  );
