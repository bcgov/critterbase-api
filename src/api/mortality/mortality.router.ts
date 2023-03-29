import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { createMortality, deleteMortality, getAllMortalities, getMortalityByCritter, getMortalityById, updateMortality } from "./mortality.service";
import { apiError } from "../../utils/types";
import { MortalityCreateSchema } from "./mortality.types";
import { prisma } from "../../utils/constants";
import { uuidParamsSchema } from "../../utils/zod_helpers";

export const mortalityRouter = express.Router();

/**
 ** Mortality Router Home
 */
 mortalityRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const mort = await  getAllMortalities();
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

mortalityRouter.get("/critter/:critter_id",
  catchErrors(async (req: Request, res: Response) => {
    const id = req.params.critter_id;
    //Leaving in this one since it succeeds otherwise, but I think the user should know 
    //that the array they get is empty because the critter isn't real
    const exists = await prisma.critter.findUnique({
      where: {
        critter_id: id
      }
    });
    if(!exists) {
      throw apiError.notFound('No critter id found.')
    }
    const mort = await getMortalityByCritter(id);
    return res.status(200).json(mort);
  })
);

/**
 * * All mortality_id related routes
 */
mortalityRouter
  .route("/:id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      uuidParamsSchema.parse(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const mort = await getMortalityById(id);
      return res.status(200).json(mort);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const parsed = MortalityCreateSchema.parse(req.body);
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
