import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { getUsers } from "./user.service";
import { apiError } from "../../utils/types";

export const userRouter = express.Router();

/**
 ** User Router Home
 */
userRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(200).json("User Router");
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
 * * All user_id related routes
 */
userRouter
  .route("/:user_id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      //Check if user exists before running next routes.
      //Temp for testing
      if (!["1", "2", "3"].includes(user_id)) {
        throw apiError.notFound("User ID not found");
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const user = getUsers();
      return res.status(200).json(user);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      return res.status(200).json(`Update user ${id}`);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      return res.status(200).json(`Delete user ${id}`);
    })
  );
