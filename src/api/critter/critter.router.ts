/* eslint-disable @typescript-eslint/require-await */
import { Prisma } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/constants";
import { formatParse, getFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { apiError } from "../../utils/types";
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

export const CritterRouter = (db: ICbDatabase) => {
  const critterRouter = express.Router();

  /**
   ** Critter Router Home
   */
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
              mode: 'insensitive'
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
      if(Object.values(whereInput).every(a => !a)) {
        return res.status(200).json([]);
      }
      const allCritters = await formatParse(
        getFormat(req),
        db.getAllCritters(getFormat(req), whereInput),
        critterFormats
      );
      return res.status(200).json(allCritters);
    })
  );

  critterRouter.get(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      const { wlh_id } = CritterQuerySchema.parse(req.query);
      const critters = await formatParse(
        getFormat(req),
        wlh_id
          ? db.getCritterByWlhId(wlh_id, getFormat(req))
          : db.getAllCritters(getFormat(req)),
        critterFormats
      );
      if (Array.isArray(critters) && !critters.length && wlh_id) {
        throw apiError.notFound(`No critters found with wlh_id=${wlh_id}`);
      }
      return res.status(200).json(critters);
    })
  );

  /**
   ** Fetch multiple critters by their IDs
   */
  critterRouter.post(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      const parsed = CritterIdsRequestSchema.parse(req.body);
      const critters = await formatParse(
        getFormat(req),
        db.getMultipleCrittersByIds(parsed, getFormat(req)),
        critterFormats
      );
      return res.status(200).json(critters);
    })
  );

  critterRouter.post(
    "/unique",
    catchErrors(async (req: Request, res: Response) => {
      const parsed = UniqueCritterQuerySchema.parse(req.body);
      const unique = await formatParse(
        getFormat(req),
        db.getSimilarCritters(parsed, getFormat(req)),
        critterFormats
      );
      return res.status(200).json(unique);
    })
  );

  /**
   ** Create new critter
   */
  critterRouter.post(
    "/create",
    catchErrors(async (req: Request, res: Response) => {
      await db.appendEnglishTaxonAsUUID(req.body as Record<string, unknown>);
      const parsed = CritterCreateSchema.parse(req.body);
      const created = await formatParse(
        getFormat(req),
        db.createCritter(parsed, getFormat(req)),
        critterFormats
      );
      return res.status(201).send(created);
    })
  );

  // critterRouter.route("/wlh/:wlh_id").get(
  //   catchErrors(async (req: Request, res: Response) => {
  //     const critters = await getCritterByWlhId(req.params.wlh_id);
  //     if (!critters.length) {
  //       throw apiError.notFound(
  //         "Could not find any animals with the requested WLH ID"
  //       );
  //     }
  //     const format = critters.map((c) => CritterDetailedResponseSchema.parse(c));
  //     return res.status(200).json(format);
  //   })
  // );

  /**
   * * All critter_id related routes
   */
  critterRouter
    .route("/:id")
    .all(
      catchErrors(async (req: Request, res: Response, next: NextFunction) => {
        await uuidParamsSchema.parseAsync(req.params);
        res.locals.format = getFormat(req);
        next();
      })
    )
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const critter = await formatParse(
          getFormat(req),
          db.getCritterById(id, getFormat(req)),
          critterFormats
        );
        return res.status(200).json(critter);
      })
    )
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const parsed = CritterUpdateSchema.parse(req.body);
        const critter = await formatParse(
          getFormat(req),
          db.updateCritter(id, parsed, getFormat(req)),
          critterFormats
        );
        res.status(200).json(critter);
      })
    )
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const critter = await formatParse(
          getFormat(req),
          db.deleteCritter(id, getFormat(req)),
          critterFormats
        );
        res.status(200).json(critter);
      })
    );

  return critterRouter;
};
