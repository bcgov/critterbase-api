import { Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';
import swaggerUIExpress from 'swagger-ui-express';
import { authenticateRequest } from '../../authentication/auth';
import { yaml } from '../../swagger';
import { ICbDatabase } from '../../utils/database';
import { catchErrors } from '../../utils/middleware';
import { UserCreateBodySchema } from '../user/user.utils';

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
  accessRouter.get('/', (req: Request, res: Response) => {
    return res.status(200).json('Welcome to Critterbase API');
  });

  /**
   * Signup endpoint
   *
   */
  accessRouter.post(
    '/signup',
    catchErrors(async (req: Request, res: Response) => {
      const kc = await authenticateRequest(req);
      const parsedUser = UserCreateBodySchema.parse({
        user_identifier: kc.identifier,
        keycloak_uuid: kc.keycloak_uuid
      });
      await db.createUser(parsedUser);
      const contextUserId = await db.setUserContext(kc.keycloak_uuid, kc.system_name);
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
