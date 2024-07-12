import type { Request, Response } from 'express';
import express, { NextFunction } from 'express';
import { ICbDatabase } from '../../utils/database';
import { catchErrors } from '../../utils/middleware';
import { uuidParamsSchema } from '../../utils/zod_helpers';
import { CreateUserSchema, UpdateUserSchema } from '../../schemas/user-schema';

export const UserRouter = (db: ICbDatabase) => {
  const userRouter = express.Router();

  /**
   * Create user
   *
   */
  userRouter.post(
    '/create',
    catchErrors(async (req: Request, res: Response) => {
      const userData = CreateUserSchema.parse(req.body);
      const newUser = await db.userService.createOrGetUser(userData);
      return res.status(201).json(newUser);
    })
  );

  /**
   * All user_id related routes
   *
   */
  userRouter
    .route('/:id')
    .all(
      catchErrors(async (req: Request, _res: Response, next: NextFunction) => {
        await uuidParamsSchema.parseAsync(req.params);
        next();
      })
    )
    /**
     * Get user by id
     *
     */
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const user = await db.userService.getUserById(req.params.id);
        return res.status(200).json(user);
      })
    )
    /**
     * Update user
     *
     */
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const userData = UpdateUserSchema.parse(req.body);
        const user = await db.userService.updateUser(req.params.id, userData);
        return res.status(200).json(user);
      })
    );

  return userRouter;
};
