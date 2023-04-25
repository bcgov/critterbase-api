/* eslint-disable @typescript-eslint/require-await */
import express, { NextFunction, Request, Response } from "express";
import { formatParse, getFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { QueryFormats, apiError } from "../../utils/types";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  appendEnglishTaxonAsUUID,
  createCritter,
  deleteCritter,
  getAllCritters,
  getCritterByIdWithDetails,
  getCritterByWlhId,
  getSimilarCritters,
  getMultipleCrittersByIds,
  updateCritter,
} from "./critter.service";
import {
  CritterCreateSchema,
  CritterDetailedResponseSchema,
  CritterIdsRequestSchema,
  CritterQuerySchema,
  CritterUpdateSchema,
  critterFormats,
} from "./critter.utils";
import { Prisma } from "@prisma/client";
import { prisma } from "../../utils/constants";

export const critterRouter = express.Router();

/**
 ** Critter Router Home
 */
critterRouter.post(
  "/filter",
  catchErrors(async (req: Request, res: Response) => {
    const {critter_ids, animal_ids, wlh_ids} = req.body;
    let {taxon_ids, taxon_name_commons} = req.body;
    if(taxon_name_commons) {
      const uuids = await prisma.lk_taxon.findMany({
        where: {
          taxon_name_common: { [taxon_name_commons.negate ? 'notIn' : 'in']: taxon_name_commons.body }
        }
      });
      taxon_ids = { body: uuids.map(a => a.taxon_id), negate: false };
    }

    const whereInput: Prisma.critterWhereInput = {
      critter_id: critter_ids?.body.length ? 
        { [critter_ids.negate ? 'notIn' : 'in']: critter_ids.body } : undefined,
      animal_id: animal_ids?.body.length ? 
        { [animal_ids.negate ? 'notIn' : 'in']: animal_ids.body } : undefined,
      wlh_id: wlh_ids?.body.length ? 
        { [wlh_ids.negate ? 'notIn' : 'in']: wlh_ids.body } : undefined,
      taxon_id: taxon_ids?.body.length ? 
        { [taxon_ids.negate ? 'notIn' : 'in']: taxon_ids.body } : undefined
    }
    const allCritters = await getAllCritters(QueryFormats.default, whereInput);
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
        ? getCritterByWlhId(wlh_id, getFormat(req))
        : getAllCritters(getFormat(req)),
      critterFormats
    );
    if (Array.isArray(critters) && !critters.length && wlh_id) {
      throw apiError.notFound(`No critters found with wlh_id=${wlh_id}`);
    }
    return res.status(200).json(critters);
  }))

/**
 ** Fetch multiple critters by their IDs
 */
critterRouter.post(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const parsed = CritterIdsRequestSchema.parse(req.body);
    const critters = await formatParse(
      getFormat(req),
      getMultipleCrittersByIds(parsed, getFormat(req)),
      critterFormats
    );
    return res.status(200).json(critters);
  })
);

/**
 ** Create new critter
 */
critterRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    await appendEnglishTaxonAsUUID(req.body);
    const parsed = CritterCreateSchema.parse(req.body);
    const created = await formatParse(
      getFormat(req),
      createCritter(parsed, getFormat(req)),
      critterFormats
    );
    return res.status(201).send(created);
  })
);

critterRouter.post(
  '/unique',
  catchErrors(async (req: Request, res: Response) => {
    const unique = await getSimilarCritters(req.body);
    return res.status(200).json(unique);
  })
)


critterRouter.route("/wlh/:wlh_id").get(
  catchErrors(async (req: Request, res: Response) => {
    const critters = await getCritterByWlhId(req.params.wlh_id);
    if (!critters.length) {
      throw apiError.notFound(
        "Could not find any animals with the requested WLH ID"
      );
    }
    const format = critters.map((c) => CritterDetailedResponseSchema.parse(c));
    return res.status(200).json(format);
  })
);

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
        getCritterByIdWithDetails(id, getFormat(req)),
        critterFormats
      );
      return res.status(200).json(critter);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const parsed = CritterUpdateSchema.parse(req.body);
      const critter = await formatParse(
        getFormat(req),
        updateCritter(id, parsed, getFormat(req)),
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
        deleteCritter(id, getFormat(req)),
        critterFormats
      );
      res.status(200).json(critter);
    })
  );
