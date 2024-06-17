import { Request, Response } from 'express';
import { catchErrors } from '../../utils/middleware';
import swaggerUIExpress from 'swagger-ui-express';
import { Prisma } from '@prisma/client';
import { yaml } from '../../swagger';
import express from 'express';
import { ICbDatabase } from '../../utils/database';

/**
 * Access Router
 *
 * @description Endpoints without authentication
 */
export const AccessRouter = (db: ICbDatabase) => {
  const accessRouter = express.Router();

  /**
   * Welcome to Critterbase home endpoint.
   *
   */
  accessRouter.get('/', (_req: Request, res: Response) => {
    return res.status(200).json('Welcome to Critterbase API');
  });

  /**
   * Swagger API documentation.
   *
   */
  accessRouter.use('/swagger', swaggerUIExpress.serve, swaggerUIExpress.setup(yaml));

  /**
   * Get table types
   *
   */
  accessRouter.get(
    '/types/:model',
    catchErrors(async (req: Request, res: Response) => {
      const types = await db.getTableDataTypes(req.params.model as Prisma.ModelName);
      return res.status(200).json(types);
    })
  );

  return accessRouter;
};
