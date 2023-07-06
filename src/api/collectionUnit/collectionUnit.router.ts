import type { Request, Response } from "express";
import express, { NextFunction } from "express";
import { array } from "zod";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  CollectionUnitCreateBodySchema,
  CollectionUnitResponseSchema,
  CollectionUnitUpdateBodySchema,
} from "./collectionUnit.utils";
import { ICbDatabase } from "../../utils/database";

export const CollectionUnitRouter = (db: ICbDatabase) => {
  const collectionUnitRouter = express.Router();

  /**
   ** collectionUnit Router Home
   */
  /**
   * @openapi
   * /collection-units/:
   *   get:
   *     description: Fetches all CollectionUnits
   *     responses:
   *       200:
   *         description: An array of CollectionUnits
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/CollectionUnit'
   */
  collectionUnitRouter.get(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      const collectionUnits = await db.getAllCollectionUnits();
      const formattedCollectionUnit = array(CollectionUnitResponseSchema).parse(
        collectionUnits
      );
      return res.status(200).json(formattedCollectionUnit);
    })
  );

  /**
   ** Create new collectionUnit
   */
  /**
   * @openapi
   * /collection-units/create:
   *   post:
   *     description: Creates a new CollectionUnit
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CollectionUnitCreate'
   *     responses:
   *       201:
   *         description: The created CollectionUnit
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CollectionUnit'
   */
  collectionUnitRouter.post(
    "/create",
    catchErrors(async (req: Request, res: Response) => {
      const collectionUnitData = CollectionUnitCreateBodySchema.parse(req.body);
      const collectionUnit = await db.createCollectionUnit(collectionUnitData);
      const formattedCollectionUnit =
        CollectionUnitResponseSchema.parse(collectionUnit);
      return res.status(201).json(formattedCollectionUnit);
    })
  );

  /**
   * @openapi
   * /collection-units/critter/{id}:
   *   get:
   *     description: Fetches CollectionUnits associated with a given critter id
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: An array of CollectionUnits associated with the critter
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/CollectionUnit'
   */
  collectionUnitRouter.route("/critter/:id").get(
    catchErrors(async (req: Request, res: Response) => {
      // validate uuid and confirm that critter_id exists
      const { id } = uuidParamsSchema.parse(req.params);
      await db.getCritterById(id);
      const collectionUnits = await db.getCollectionUnitsByCritterId(id);
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
        const collectionUnit = await db.getCollectionUnitById(req.params.id);
        const formattedCollectionUnit =
          CollectionUnitResponseSchema.parse(collectionUnit);
        return res.status(200).json(formattedCollectionUnit);
      })
    )
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const collectionUnitData = CollectionUnitUpdateBodySchema.parse(
          req.body
        );
        const collectionUnit = await db.updateCollectionUnit(
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
        await db.deleteCollectionUnit(id);
        return res.status(200).json(`CollectionUnit ${id} has been deleted`);
      })
    );

  return collectionUnitRouter;
};
