import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { createMortality, deleteMortality, getAllMortalities, getMortalityByCritter, getMortalityById, updateMortality } from "./mortality.service";
import { apiError } from "../../utils/types";
import { MortalityCreateBodySchema, MortalityUpdateBodySchema } from "./mortality.types";
import { prisma } from "../../utils/constants";

export const mortalityRouter = express.Router();

/**
 ** Critter Router Home
 */
 mortalityRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const mort = await  getAllMortalities();
    return res.status(200).json(mort);
  })
);

/**
 ** Create new critter
 */
 mortalityRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const parsed = MortalityCreateBodySchema.parse(req.body);
    const mort = await createMortality(parsed);
    return res.status(201).json(mort);
  })
);

mortalityRouter.get("/critter/:critter_id",
  catchErrors(async (req: Request, res: Response) => {
    const id = req.params.critter_id;
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
  .route("/:mortality_id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      const mortality_id = req.params.mortality_id;
      const result = await prisma.mortality.findUnique({
        where: {
          mortality_id: mortality_id
        }
      });
      if(result == null) {
        throw apiError.notFound('Could not find the requested mortality.')
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.mortality_id;
      const mort = await getMortalityById(id);
      return res.status(200).json(mort);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.mortality_id;
      const parsed = MortalityUpdateBodySchema.parse(req.body);
      const mort = await updateMortality(id, parsed);
      res.status(200).json(mort);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.mortality_id;
      const mort = await deleteMortality(id);
      res.status(200).json(mort);
    })
  );
