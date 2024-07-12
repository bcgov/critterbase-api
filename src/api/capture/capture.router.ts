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
      const parsed = CaptureCreateSchema.parse(req.body);

      const result = await db.captureService.createCapture(parsed);

      return res.status(201).json(result);
    })
  );

  /**
   * Get all captures of a critter
   */
  captureRouter.get(
    '/critter/:id',
    catchErrors(async (req: Request, res: Response) => {
      const parsed = uuidParamsSchema.parse(req.params);

      const result = await db.captureService.findCritterCaptures(parsed.id);

      res.status(200).json(result);
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
        const result = await db.captureService.getCaptureById(req.params.id);

        return res.status(200).json(result);
      })
    )
    /**
     * Update capture by id
     */
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const parsed = CaptureUpdateSchema.parse(req.body);

        const result = await db.captureService.updateCapture(req.params.id, parsed);

        res.status(200).json(result);
      })
    )
    /**
     * Delete capture by id
     */
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const result = await db.captureService.deleteCapture(req.params.id);

        res.status(200).json(result);
      })
    );

  return captureRouter;
};
