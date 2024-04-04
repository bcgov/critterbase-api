import type { Request, Response } from 'express';
import express, { NextFunction } from 'express';
import { catchErrors } from '../../utils/middleware';
import { uuidParamsSchema } from '../../utils/zod_helpers';
import { MortalityCreateSchema, MortalityUpdateSchema } from './mortality.utils';
import { ICbDatabase } from '../../utils/database';
/**
 * Mortality Router.
 *
 * @param {ICbDatabase} db - Critterbase database services.
 * @returns {Router} Express router.
 */
export const MortalityRouter = (db: ICbDatabase) => {
  const mortalityRouter = express.Router();

  /**
   * Get all mortalities in critterbase.
   *
   */
  mortalityRouter.get(
    '/',
    catchErrors(async (_req: Request, res: Response) => {
      const response = await db.mortalityService.getAllMortalities();
      return res.status(200).json(response);
    })
  );

  /**
   * Create new mortality record.
   *
   */
  mortalityRouter.post(
    '/create',
    catchErrors(async (req: Request, res: Response) => {
      const parsed = MortalityCreateSchema.parse(req.body);
      const response = await db.mortalityService.createMortality(parsed);
      return res.status(201).json(response);
    })
  );

  /**
   * Get all mortality records of a critter.
   *
   */
  mortalityRouter.get(
    '/critter/:id',
    catchErrors(async (req: Request, res: Response) => {
      const response = await db.mortalityService.getMortalityByCritter(req.params.id);
      return res.status(200).json(response);
    })
  );

  /**
   * All mortality_id related routes.
   *
   */
  mortalityRouter
    .route('/:id')
    .all(
      catchErrors(async (req: Request, _res: Response, next: NextFunction) => {
        await uuidParamsSchema.parseAsync(req.params);
        next();
      })
    )

    /**
     * Get mortality by mortality_id.
     *
     */
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const response = await db.mortalityService.getMortalityById(req.params.id);
        return res.status(200).json(response);
      })
    )

    /**
     * Update specific mortality record by mortality_id.
     *
     */
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const parsed = MortalityUpdateSchema.parse(req.body);
        const response = await db.mortalityService.updateMortality(req.params.id, parsed);
        res.status(200).json(response);
      })
    )

    /**
     * Update specific mortality record by mortality_id.
     *
     */
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const response = await db.mortalityService.deleteMortality(req.params.id);
        res.status(200).json(response);
      })
    );
  return mortalityRouter;
};
