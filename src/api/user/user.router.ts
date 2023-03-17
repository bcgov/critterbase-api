import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  CreateUserSchema,
  deleteUser,
  getUser,
  getUserBySystemId,
  getUsers,
  updateUser,
  UpdateUserSchema,
  upsertUser,
} from "./user.service";
import { apiError } from "../../utils/types";
import { uuidParamsSchema } from "../../utils/zod_schemas";
import { strings } from "../../utils/constants";

export const userRouter = express.Router();

/**
 ** User Router Home
 */
userRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const users = await getUsers();
    return res.status(200).json(users);
  })
);

/**
 ** Create new user
 */
userRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const userData = await CreateUserSchema.parseAsync(req.body);
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
      // validate user id and confirm that user exists
      const { id } = uuidParamsSchema.parse(req.params);
      res.locals.userData = await getUser(id);
      if (!res.locals.userData) {
        throw apiError.notFound(strings.user.notFound);
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      // using stored data from validation to avoid duplicate query
      return res.status(200).json(res.locals.userData);
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const userData = await UpdateUserSchema.parseAsync(req.body);
      const user = await updateUser(req.params.id, userData);
      return res.status(200).json(user);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      await deleteUser(id);
      return res.status(200).json(`User ${id} has been deleted`);
    })
  );
