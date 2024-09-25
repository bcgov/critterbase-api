import type { Request, Response } from 'express';
import express, { NextFunction } from 'express';
import { CaptureCreateSchema, CaptureUpdateSchema } from '../../schemas/capture-schema';
import { ICbDatabase } from '../../utils/database';
import { catchErrors } from '../../utils/middleware';
import { uuidParamsSchema } from '../../utils/zod_helpers';

/**
 * Critter Router Home
 */
export const CaptureRouter = (db: ICbDatabase) => {
  const captureRouter = express.Router();

  /**
   * Create a capture
   */
  captureRouter.post(
    '/create',
    catchErrors(async (req: Request, res: Response) => {
      const client = db.getDBClient();
      const ctx = db.getContext(req);

      const parsed = CaptureCreateSchema.parse(req.body);

      // Create a capture in a transaction
      const response = await db.transaction(ctx, client, async (txClient) => {
        const captureService = db.services.CaptureService.init(txClient);

        return captureService.createCapture(parsed);
      });

      return res.status(201).json(response);
    })
  );

  /**
   * Get all captures of a critter
   */
  captureRouter.get(
    '/critter/:id',
    catchErrors(async (req: Request, res: Response) => {
      const client = db.getDBClient();

      const parsed = uuidParamsSchema.parse(req.params);

      const captureService = db.services.CaptureService.init(client);

      const response = await captureService.findCritterCaptures(parsed.id);

      res.status(200).json(response);
    })
  );

  /**
   * All capture_id related routes
   */
  captureRouter
    .route('/:id')
    .all(
      catchErrors(async (req: Request, _res: Response, next: NextFunction) => {
        await uuidParamsSchema.parseAsync(req.params);
        next();
      })
    )

    /**
     * Get capture by id
     */
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const client = db.getDBClient();

        const captureService = db.services.CaptureService.init(client);

        const response = await captureService.getCaptureById(req.params.id);

        return res.status(200).json(response);
      })
    )

    /**
     * Update capture by id
     */
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const client = db.getDBClient();
        const ctx = db.getContext(req);

        const parsed = CaptureUpdateSchema.parse(req.body);

        // Update capture in a transaction
        const response = await db.transaction(ctx, client, async (txClient) => {
          const captureService = db.services.CaptureService.init(txClient);

          return captureService.updateCapture(req.params.id, parsed);
        });

        res.status(200).json(response);
      })
    )

    /**
     * Delete capture by id
     */
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const client = db.getDBClient();

        const captureService = db.services.CaptureService.init(client);

        const response = await captureService.deleteCapture(req.params.id);

        res.status(200).json(response);
      })
    );

  return captureRouter;
};
