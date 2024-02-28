import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import { UserCreateBodySchema, UserUpdateBodySchema } from "./user.utils";
import { ICbDatabase } from "../../utils/database";

export const UserRouter = (db: ICbDatabase) => {
  const userRouter = express.Router();

  userRouter.get(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      const users = await db.getUsers();
      return res.status(200).json(users);
    }),
  );

  userRouter.post(
    "/create",
    catchErrors(async (req: Request, res: Response) => {
      const userData = UserCreateBodySchema.parse(req.body);
      const newUser = await db.createUser(userData);
      return res.status(201).json(newUser);
    }),
  );

  userRouter
    .route("/:id")
    .all(
      catchErrors(async (req: Request, res: Response, next: NextFunction) => {
        await uuidParamsSchema.parseAsync(req.params);
        next();
      }),
    )
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const user = await db.getUser(req.params.id);
        return res.status(200).json(user);
      }),
    )
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const userData = UserUpdateBodySchema.parse(req.body);
        const user = await db.updateUser(req.params.id, userData);
        return res.status(200).json(user);
      }),
    )
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const deleted = await db.deleteUser(req.params.id);
        return res.status(200).json(deleted);
      }),
    );

  return userRouter;
};
