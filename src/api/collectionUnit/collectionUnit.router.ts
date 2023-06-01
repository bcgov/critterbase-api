import type { Request, Response } from "express";
import express, { NextFunction } from "express";
import { array } from "zod";
import { prisma } from "../../utils/constants";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  createCollectionUnit,
  deleteCollectionUnit,
  getAllCollectionUnits,
  getCollectionUnitById,
  getCollectionUnitsByCritterId,
  updateCollectionUnit,
} from "./collectionUnit.service";
import {
  CollectionUnitCreateBodySchema,
  CollectionUnitResponseSchema,
  CollectionUnitUpdateBodySchema,
} from "./collectionUnit.utils";

export const collectionUnitRouter = express.Router();

/**
 ** collectionUnit Router Home
 */
collectionUnitRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const collectionUnits = await getAllCollectionUnits();
    const formattedCollectionUnit = array(CollectionUnitResponseSchema).parse(
      collectionUnits
    );
    return res.status(200).json(formattedCollectionUnit);
  })
);

/**
 ** Create new collectionUnit
 */
collectionUnitRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const collectionUnitData = CollectionUnitCreateBodySchema.parse(req.body);
    const collectionUnit = await createCollectionUnit(collectionUnitData);
    const formattedCollectionUnit =
      CollectionUnitResponseSchema.parse(collectionUnit);
    const temp: any;
    return res.status(201).json(formattedCollectionUnit);
  })
);

collectionUnitRouter.route("/critter/:id").get(
  catchErrors(async (req: Request, res: Response) => {
    // validate uuid and confirm that critter_id exists
    const { id } = uuidParamsSchema.parse(req.params);
    await prisma.critter.findUniqueOrThrow({
      where: { critter_id: id },
    });
    const collectionUnits = await getCollectionUnitsByCritterId(id);
    const formattedCollectionUnit = array(CollectionUnitResponseSchema).parse(
      collectionUnits
    );
    return res.status(200).json(formattedCollectionUnit);
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
      await uuidParamsSchema.parseAsync(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const collectionUnit = await getCollectionUnitById(req.params.id);
      const formattedCollectionUnit =
        CollectionUnitResponseSchema.parse(collectionUnit);
      return res.status(200).json(formattedCollectionUnit);
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const collectionUnitData = CollectionUnitUpdateBodySchema.parse(req.body);
      const collectionUnit = await updateCollectionUnit(
        req.params.id,
        collectionUnitData
      );
      const formattedCollectionUnit =
        CollectionUnitResponseSchema.parse(collectionUnit);
      return res.status(200).json(formattedCollectionUnit);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      await deleteCollectionUnit(id);
      return res.status(200).json(`CollectionUnit ${id} has been deleted`);
    })
  );
