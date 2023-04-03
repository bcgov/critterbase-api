import type { Request, Response } from "express";
import express, { NextFunction } from "express";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import { getCritterById } from "../critter/critter.service";
import {
  createMortality,
  deleteMortality,
  getAllMortalities,
  getMortalityByCritter,
  getMortalityById,
  updateMortality,
} from "./mortality.service";
import {
  MortalityCreateSchema,
  MortalityResponseSchema,
  MortalityUpdateSchema,
} from "./mortality.utils";

export const mortalityRouter = express.Router();

/**
 ** Mortality Router Home
 */
mortalityRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const mort = await getAllMortalities();
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
    const mort = await createMortality(parsed);
    return res.status(201).json(mort);
  })
);

mortalityRouter.get(
  "/critter/:critter_id",
  catchErrors(async (req: Request, res: Response) => {
    const id = req.params.critter_id;
    //Leaving in this one since it succeeds otherwise, but I think the user should know
    //that the array they get is empty because the critter isn't real
    await getCritterById(id);
    const mort = await getMortalityByCritter(id);
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
      const mort = await getMortalityById(id);
      const parsed = MortalityResponseSchema.parse(mort);
      return res.status(200).json(parsed);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const parsed = MortalityUpdateSchema.parse(req.body);
      console.log("parsed was  " + JSON.stringify(parsed, null, 2));
      const mort = await updateMortality(id, parsed);
      res.status(200).json(mort);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const mort = await deleteMortality(id);
      res.status(200).json(mort);
    })
  );
