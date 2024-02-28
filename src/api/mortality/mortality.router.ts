import type { Request, Response } from "express";
import express, { NextFunction } from "express";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  MortalityCreateSchema,
  MortalityResponseSchema,
  MortalityUpdateSchema
} from "./mortality.utils";
import { ICbDatabase } from "../../utils/database";

export const MortalityRouter = (db: ICbDatabase) => {
  const mortalityRouter = express.Router();

  /**
   ** Mortality Router Home
   */
  mortalityRouter.get(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      const mort = await db.getAllMortalities();
      return res.status(200).json(mort);
    })
  );

  /**
   ** Create new mortality
   */
  mortalityRouter.post(
    "/create",
    catchErrors(async (req: Request, res: Response) => {
      const parsed = MortalityCreateSchema.parse(req.body);
      const mort = await db.createMortality(parsed);
      return res.status(201).json(mort);
    })
  );

  mortalityRouter.get(
    "/critter/:id",
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const mort = await db.getMortalityByCritter(id);
      const parsed = mort.map((a) => MortalityResponseSchema.parse(a));
      return res.status(200).json(parsed);
    })
  );

  /**
   * * All mortality_id related routes
   */
  mortalityRouter
    .route("/:id")
    .all(
      catchErrors(async (req: Request, res: Response, next: NextFunction) => {
        await uuidParamsSchema.parseAsync(req.params);
        next();
      })
    )
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const mort = await db.getMortalityById(id);
        const parsed = MortalityResponseSchema.parse(mort);
        return res.status(200).json(parsed);
      })
    )
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const parsed = MortalityUpdateSchema.parse(req.body);
        const mort = await db.updateMortality(id, parsed);
        res.status(200).json(mort);
      })
    )
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const mort = await db.deleteMortality(id);
        res.status(200).json(mort);
      })
    );
  return mortalityRouter;
};
