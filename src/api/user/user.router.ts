import type { Request, Response } from 'express';
import express, { NextFunction } from 'express';
import { transaction } from '../../client/client';
import { CreateUserSchema, UpdateUserSchema } from '../../schemas/user-schema';
import { UserService } from '../../services/user-service';
import { getContext } from '../../utils/context';
import { ICbDatabase } from '../../utils/database';
import { catchErrors } from '../../utils/middleware';
import { uuidParamsSchema } from '../../utils/zod_helpers';

export const UserRouter = (db: ICbDatabase) => {
  const userRouter = express.Router();

  /**
   * Create user
   *
   */
  userRouter.post(
    '/create',
    catchErrors(async (req: Request, res: Response) => {
      const ctx = getContext(req);

      // Create user in a transaction
      const response = await transaction(ctx, async (txClient) => {
        const userService = UserService.init(txClient);
        const userData = CreateUserSchema.parse(req.body);

        return userService.createUser(userData);
      });

      return res.status(201).json(response);
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
        const userService = UserService.init(db.client);

        const user = await userService.getUserById(req.params.id);

        return res.status(200).json(user);
      })
    )
    /**
     * Update user
     *
     */
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const userService = UserService.init(db.client);
        const userData = UpdateUserSchema.parse(req.body);

        const user = await userService.updateUser(req.params.id, userData);

        return res.status(200).json(user);
      })
    );

  return userRouter;
};
