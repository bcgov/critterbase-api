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
  getCollectionUnitsFromCategory,
} from "./collectionUnit.service";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  CollectionUnitCategorySchema,
  CollectionUnitCreateBodySchema,
  CollectionUnitUpdateBodySchema,
  collectionUnitResponseSchema,
} from "./collectionUnit.utils";
import { array } from "zod";
import { prisma } from "../../utils/constants";

export const collectionUnitRouter = express.Router();

/**
 ** collectionUnit Router Home
 */
collectionUnitRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const collectionUnits = await getAllCollectionUnits();
    const formattedCollectionUnit = array(collectionUnitResponseSchema).parse(
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
      collectionUnitResponseSchema.parse(collectionUnit);
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
    const formattedCollectionUnit = array(collectionUnitResponseSchema).parse(
      collectionUnits
    );
    return res.status(200).json(formattedCollectionUnit);
  })
);

collectionUnitRouter.route("/category/").get(
  catchErrors(async (req: Request, res: Response) => {
    const parsed = CollectionUnitCategorySchema.parse(req.params);
    const response = await getCollectionUnitsFromCategory(parsed.category_name, parsed.taxon_name_common, parsed.taxon_name_latin);
    return res.status(200).json(response);
  })
)

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
        collectionUnitResponseSchema.parse(collectionUnit);
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
        collectionUnitResponseSchema.parse(collectionUnit);
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
