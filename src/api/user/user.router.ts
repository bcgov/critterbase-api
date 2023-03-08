import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { deleteUser, getUser, getUsers, updateUser } from "./user.service";
import { apiError } from "../../utils/types";

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
    return res.status(201).json(`Post new user`);
  })
);

/**
 ** All user_id related routes
 */
userRouter
  .route("/:user_id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      //Check if user exists before running next routes.
      const user = await getUser(user_id);
      if (!user) {
        throw apiError.notFound("User ID not found");
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.user_id;
      const user = await getUser(id);
      return res.status(200).json(user);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const user_id = req.params.user_id;
      const user = await updateUser(user_id, req.body);
      return res.status(200).json(user);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const user_id = req.params.user_id;
      await deleteUser(user_id);
      return res.status(200).json(`User ${user_id} has been deleted`);
    })
  );
