import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors, validateUuidParam } from "../../utils/middleware";
import {
  deleteUser,
  getUser,
  getUserBySystemId,
  getUsers,
  updateUser,
  upsertUser,
} from "./user.service";
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
    const userData = req.body;
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
      const id = validateUuidParam(req);
      const user = await getUser(id);
      if (!user) {
        throw apiError.notFound(`User ID "${id}" not found`);
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const user = await getUser(id);
      return res.status(200).json(user);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;

      // check if any unique columns are being updated
      const { user_id, system_user_id } = req.body;
      if (system_user_id) {
        // requesting id change
        const currentSUI = (await getUser(id))?.system_user_id;
        if (
          system_user_id !== currentSUI && // new id is different
          !!(await getUserBySystemId(system_user_id)) // id exists already
        ) {
          throw apiError.conflictIssue(
            `system_user_id ${system_user_id} already exists`
          );
        }
      }
      const user = await updateUser(id, req.body);
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