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
} from "./collectionUnit.service";
import { apiError } from "../../utils/types";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  CollectionUnitCreateBodySchema,
  CollectionUnitUpdateBodySchema,
} from "./collectionUnit.types";

export const collectionUnitRouter = express.Router();

/**
 ** collectionUnit Router Home
 */
collectionUnitRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(200).json(await getAllCollectionUnits());
  })
);

/**
 ** Create new collectionUnit
 */
collectionUnitRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const collectionUnitData = CollectionUnitCreateBodySchema.parse(req.body);
    const newCollectionUnit = await createCollectionUnit(collectionUnitData);
    return res.status(201).json(newCollectionUnit);
  })
);

collectionUnitRouter.route("/critter/:id").get(
  catchErrors(async (req: Request, res: Response) => {
    // validate uuid
    const { id } = uuidParamsSchema.parse(req.params);
    const collectionUnits = await getCollectionUnitsByCritterId(id);
    if (!collectionUnits.length) {
      throw apiError.notFound(
        `Critter ID "${id}" has no associated collectionUnits`
      );
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
      // validate uuid
      uuidParamsSchema.parse(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      return res.status(200).json(await getCollectionUnitById(req.params.id));
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const collectionUnitData = CollectionUnitUpdateBodySchema.parse(req.body);
      const collectionUnit = await updateCollectionUnit(
        req.params.id,
        collectionUnitData
      );
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
