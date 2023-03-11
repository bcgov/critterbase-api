import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { getAllCritters, getCritterById, updateCritter } from "./critter.service";
import { apiError } from "../../utils/types";
import { prisma } from "../../utils/constants";

export const critterRouter = express.Router();

/**
 ** Critter Router Home
 */
critterRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const allCritters = getAllCritters();
    return res.status(200).json(allCritters);
  })
);

/**
 ** Create new critter
 */
critterRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(201).json(`Post new critter`);
  })
);

/**
 * * All critter_id related routes
 */
critterRouter
  .route("/:critter_id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      const critter_id = req.params.critter_id;
      const critter = await getCritterById(critter_id);
      if(!critter) {
        return res.status(404);
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const critter = await getCritterById(id);
      return res.status(200).json(critter);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const critter = await updateCritter(id, req.body);
      res.status(200).json(`Update critter ${id}`);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      res.status(200).json(`Delete critter ${id}`);
    })
  );
