import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { createCritter, deleteCritter, getAllCritters, getCritterById, getCritterByIdWithDetails, getCritterByWlhId, updateCritter } from "./critter.service";
import { apiError } from "../../utils/types";
import { prisma } from "../../utils/constants";

export const critterRouter = express.Router();

/**
 ** Critter Router Home
 */
 critterRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const allCritters = await getAllCritters();
    return res.status(200).json(allCritters);
  })
);

/**
 ** Create new critter
 */
 critterRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const created = await createCritter(req.body);
    return res.status(201).send(created);
  })
);

critterRouter
  .route("/wlh/:wlh_id")
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const critter = await getCritterByWlhId(req.params.wlh_id); 
      if(!critter?.length) {
        throw apiError.notFound('Could not find any animals with the requested WLH ID');
      }
      return res.status(200).json(critter);
    })    
  )

/**
 * * All critter_id related routes
 */
critterRouter
  .route("/:critter_id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      const critter_id = req.params.critter_id;
      const critter = await getCritterById(critter_id);
      if(critter == null) {
        throw apiError.notFound('The requested critter id was not found.');
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.critter_id;
      const critter = await getCritterByIdWithDetails(id);
      return res.status(200).json(critter);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.critter_id;
      const critter = await updateCritter(id, req.body);
      res.status(200).json(critter);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.critter_id;
      const critter = await deleteCritter(id);
      res.status(200).json(critter);
    })
  );
