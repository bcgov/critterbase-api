import type { Request, Response } from 'express';
import express, { NextFunction } from 'express';
import { MortalityCreateSchema, MortalityUpdateSchema } from '../../schemas/mortality-schema';
import { ICbDatabase } from '../../utils/database';
import { catchErrors } from '../../utils/middleware';
import { zodID } from '../../utils/zod_helpers';

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
    '/critter/:critter_id',
    catchErrors(async (req: Request, res: Response) => {
      const critter_id = zodID.parse(req.params.critter_id);

      const response = await db.mortalityService.getMortalityByCritter(critter_id);

      return res.status(200).json(response);
    })
  );

  /**
   * All mortality_id related routes.
   *
   */
  mortalityRouter
    .route('/:mortality_id')
    .all(
      catchErrors(async (req: Request, _res: Response, next: NextFunction) => {
        await zodID.parseAsync(req.params.mortality_id);

        next();
      })
    )

    /**
     * Get mortality by mortality_id.
     *
     */
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const mortality_id = req.params.mortality_id;

        const response = await db.mortalityService.getMortalityById(mortality_id);

        return res.status(200).json(response);
      })
    )

    /**
     * Update specific mortality record.
     *
     */
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const parsed = MortalityUpdateSchema.parse(req.body);
        const mortality_id = req.params.mortality_id;

        const response = await db.mortalityService.updateMortality(mortality_id, parsed);

        res.status(200).json(response);
      })
    )

    /**
     * Delete specific mortality record.
     *
     */
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const mortality_id = req.params.mortality_id;

        const response = await db.mortalityService.deleteMortality(mortality_id);

        res.status(200).json(response);
      })
    );
  return mortalityRouter;
};
