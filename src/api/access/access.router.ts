import { Request, Response } from 'express';
import { catchErrors } from '../../utils/middleware';
import swaggerUIExpress from 'swagger-ui-express';
import { Prisma } from '@prisma/client';
import { yaml } from '../../swagger';
import express from 'express';
import { ICbDatabase } from '../../utils/database';
import { authenticateRequest } from '../../authentication/auth';
import { CreateUserSchema } from '../../schemas/user-schema';

export const AccessRouter = (db: ICbDatabase) => {
  const accessRouter = express.Router();

  /**
   * Swagger API documentation.
   *
   */
  accessRouter.use('/swagger', swaggerUIExpress.serve, swaggerUIExpress.setup(yaml));

  /**
   * Welcome to Critterbase home endpoint.
   *
   */
  accessRouter.get('/', (_req: Request, res: Response) => {
    return res.status(200).json('Welcome to Critterbase API');
  });

  /**
   * Signup endpoint
   *
   */
  accessRouter.post(
    '/signup',
    catchErrors(async (req: Request, res: Response) => {
      const authUser = await authenticateRequest(req);

      await db.createUser(parsedUser);

      const contextUserId = await db.setUserContext(authUser.keycloak_uuid, authUser.system_name);
      return res.status(201).json({ user_id: contextUserId }).end();
    })
  );

  accessRouter.get(
    '/types/:model',
    catchErrors(async (req: Request, res: Response) => {
      const types = await db.getTableDataTypes(req.params.model as Prisma.ModelName);
      return res.status(200).json(types);
    })
  );

  return accessRouter;
};
