/* eslint-disable @typescript-eslint/require-await */
import { Prisma } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/constants";
import { formatParse, getFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";

import {
  CritterCreateSchema,
  CritterFilterSchema,
  CritterIdsRequestSchema,
  CritterQuerySchema,
  CritterUpdateSchema,
  UniqueCritterQuerySchema,
  critterFormats,
} from "./critter.utils";
import { ICbDatabase } from "../../utils/database";

/**
 *
 * Critter Router
 *
 */
export const CritterRouter = (db: ICbDatabase) => {
  const critterRouter = express.Router();

  /**
   * Fetch all critters or all critters with matching WLH id.
   *
   */
  critterRouter.get(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      const { wlh_id } = CritterQuerySchema.parse(req.query);

      const service = new db.CritterService();

      const response = service.getAllCrittersOrCrittersWithWlhId(wlh_id);

      return res.status(200).json(response);
    }),
  );

  /**
   * Fetch multiple critters by critter ids.
   * Note: Post Request.
   *
   */
  critterRouter.post(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      const { critter_ids } = CritterIdsRequestSchema.parse(req.body);

      const service = new db.CritterService();

      const response = service.getMultipleCrittersByIds(critter_ids);

      return res.status(200).json(response);
    }),
  );

  critterRouter.post(
    "/filter",
    catchErrors(async (req: Request, res: Response) => {
      const parsed = CritterFilterSchema.parse(req.body);
      const {
        critter_ids,
        animal_ids,
        wlh_ids,
        collection_units,
        taxon_name_commons,
      } = parsed;
      let { taxon_ids } = parsed;

      if (taxon_name_commons) {
        const uuids = await prisma.lk_taxon.findMany({
          where: {
            taxon_name_common: {
              [taxon_name_commons.negate ? "notIn" : "in"]:
                taxon_name_commons.body,
              mode: "insensitive",
            },
          },
        });
        taxon_ids = { body: uuids.map((a) => a.taxon_id), negate: false };
      }

      const whereInput: Prisma.critterWhereInput = {
        critter_id: critter_ids?.body.length
          ? { [critter_ids.negate ? "notIn" : "in"]: critter_ids.body }
          : undefined,
        animal_id: animal_ids?.body.length
          ? { [animal_ids.negate ? "notIn" : "in"]: animal_ids.body }
          : undefined,
        wlh_id: wlh_ids?.body.length
          ? { [wlh_ids.negate ? "notIn" : "in"]: wlh_ids.body }
          : undefined,
        taxon_id: taxon_ids?.body.length
          ? { [taxon_ids.negate ? "notIn" : "in"]: taxon_ids.body }
          : undefined,
        critter_collection_unit: collection_units?.body.length
          ? {
              some: {
                collection_unit_id: {
                  [collection_units.negate ? "notIn" : "in"]:
                    collection_units.body,
                },
              },
            }
          : undefined,
      };
      if (Object.values(whereInput).every((a) => !a)) {
        return res.status(200).json([]);
      }
      const allCritters = await formatParse(
        getFormat(req),
        db.getAllCritters(getFormat(req), whereInput),
        critterFormats,
      );
      return res.status(200).json(allCritters);
    }),
  );
  critterRouter.post(
    "/unique",
    catchErrors(async (req: Request, res: Response) => {
      const parsed = UniqueCritterQuerySchema.parse(req.body);
      const unique = await formatParse(
        getFormat(req),
        db.getSimilarCritters(parsed, getFormat(req)),
        critterFormats,
      );
      return res.status(200).json(unique);
    }),
  );

  /**
   * Create a new critter
   *
   */
  critterRouter.post(
    "/create",
    catchErrors(async (req: Request, res: Response) => {
      await db.appendEnglishTaxonAsUUID(req.body as Record<string, unknown>);
      const parsed = CritterCreateSchema.parse(req.body);
      const created = await formatParse(
        getFormat(req),
        db.createCritter(parsed, getFormat(req)),
        critterFormats,
      );
      return res.status(201).send(created);
    }),
  );

  /**
   * All critter id related routes
   * Note: Parsing id at top level.
   *
   */
  critterRouter
    .route("/:id")
    .all(
      catchErrors(async (req: Request, res: Response, next: NextFunction) => {
        await uuidParamsSchema.parseAsync(req.params);
        next();
      }),
    )
    //TODO: Swagger Doc
    /**
     * Fetch a critter by critter id.
     *
     */
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const critterId = req.params.id;
        const format = getFormat(req);

        const service = new db.CritterService();

        const response = await service.getCritterById(critterId, format);

        return res.status(200).json(response);
      }),
    )
    // TODO: swagger doc
    /**
     * Update a critter by critter id.
     *
     */
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const critterId = req.params.id;
        const payload = CritterUpdateSchema.parse(req.body);

        const service = new db.CritterService();

        const response = await service.updateCritter(critterId, payload);

        return res.status(201).json(response);
      }),
    );

  return critterRouter;
};
