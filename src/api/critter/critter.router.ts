import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  createCritter,
  deleteCritter,
  getAllCritters,
  getCritterById,
  getCritterByIdWithDetails,
  getCritterByWlhId,
  updateCritter,
} from "./critter.service";
import { apiError } from "../../utils/types";
import { prisma } from "../../utils/constants";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import { CritterCreateSchema, CritterUpdateSchema } from "./critter.types";

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
    const parsed = CritterCreateSchema.parse(req.body);
    const created = await createCritter(parsed);
    return res.status(201).send(created);
  })
);

critterRouter.route("/wlh/:wlh_id").get(
  catchErrors(async (req: Request, res: Response) => {
    const critter = await getCritterByWlhId(req.params.wlh_id);
    if (!critter.length) {
      throw apiError.notFound(
        "Could not find any animals with the requested WLH ID"
      );
    }
    return res.status(200).json(critter);
  })
);

/**
 * * All critter_id related routes
 */
critterRouter
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
      const critter = await getCritterByIdWithDetails(id);
      return res.status(200).json(critter);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const parsed = CritterUpdateSchema.parse(req.body);
      const critter = await updateCritter(id, parsed);
      res.status(200).json(critter);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const critter = await deleteCritter(id);
      res.status(200).json(critter);
    })
  );
