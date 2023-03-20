import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  getAllCollectionUnits,
  getCollectionUnitById,
  getCollectionUnitsByCritterId,
  updateCollectionUnit,
  createCollectionUnit,
  deleteCollectionUnit,
  CreateCollectionUnitSchema,
  UpdateCollectionUnitSchema,
} from "./collectionUnit.service";
import { apiError } from "../../utils/types";
import { uuidParamsSchema } from "../../utils/zod_schemas";
import { strings } from "../../utils/constants";

export const collectionUnitRouter = express.Router();

/**
 ** collectionUnit Router Home
 */
collectionUnitRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const collectionUnits = await getAllCollectionUnits();
    return res.status(200).json(collectionUnits);
  })
);

/**
 ** Create new collectionUnit
 */
collectionUnitRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const collectionUnitData = CreateCollectionUnitSchema.parse(req.body);
    const newCollectionUnit = await createCollectionUnit(collectionUnitData);
    return res.status(201).json(newCollectionUnit);
  })
);

collectionUnitRouter.route("/critter/:id").get(
  catchErrors(async (req: Request, res: Response) => {
    // validate collectionUnit id and confirm that collectionUnit exists
    const { id } = uuidParamsSchema.parse(req.params);
    const collectionUnits = await getCollectionUnitsByCritterId(id);
    if (!collectionUnits.length) {
      throw apiError.notFound(`Critter ID "${id}" has no associated collectionUnits`);
    }
    return res.status(200).json(collectionUnits);
  })
);

/**
 ** All collectionUnit_id related routes
 */
collectionUnitRouter
  .route("/:id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      // validate collectionUnit id and confirm that collectionUnit exists
      const { id } = uuidParamsSchema.parse(req.params);
      res.locals.collectionUnitData = await getCollectionUnitById(id);
      if (!res.locals.collectionUnitData) {
        throw apiError.notFound(strings.marking.notFound);
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      // using stored data from validation to avoid duplicate query
      return res.status(200).json(res.locals.collectionUnitData);
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const collectionUnitData = UpdateCollectionUnitSchema.parse(req.body);
      const collectionUnit = await updateCollectionUnit(req.params.id, collectionUnitData);
      return res.status(200).json(collectionUnit);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      await deleteCollectionUnit(id);
      return res.status(200).json(`CollectionUnit ${id} has been deleted`);
    })
  );
