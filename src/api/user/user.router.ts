import type { Request, Response } from 'express';
import express, { NextFunction } from 'express';
import { CreateUserSchema, UpdateUserSchema } from '../../schemas/user-schema';
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
      const client = db.getDBClient();
      const ctx = db.getContext(req);

      const userData = CreateUserSchema.parse(req.body);

      // Create user in a transaction
      const response = await db.transaction(ctx, client, async (txClient) => {
        const userService = db.services.UserService.init(txClient);

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
        const client = db.getDBClient();

        const userService = db.services.UserService.init(client);

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
        const client = db.getDBClient();
        const context = db.getContext(req);

        const userData = UpdateUserSchema.parse(req.body);

        // Update user in a transaction
        const response = await db.transaction(context, client, async (txClient) => {
          const userService = db.services.UserService.init(txClient);

          return userService.updateUser(req.params.id, userData);
        });

        return res.status(200).json(response);
      })
    );

  return userRouter;
};
