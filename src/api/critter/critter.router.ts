import express, { NextFunction, Request, Response } from "express";
import { formatParse, getFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { CritterParse, apiError } from "../../utils/types";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  createCritter,
  deleteCritter,
  getAllCritters,
  getCritterByIdWithDetails,
  getCritterByWlhId,
  getMultipleCrittersByIds,
  updateCritter,
} from "./critter.service";
import {
  CritterCreateSchema,
  CritterDetailedResponseSchema,
  CritterIdsRequestSchema,
  CritterUpdateSchema,
  critterFormatOptions,
} from "./critter.utils";
import { format } from "path";

export const critterRouter = express.Router();

/**
 ** Critter Router Home
 */
critterRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const critters = await formatParse(
      getFormat(req),
      getAllCritters(getFormat(req)),
      critterFormatOptions
    );
    return res.status(200).json(critters);
  })
);
// * Theses changes to remove critter specific endpoints inside the external routers
//TODO GET critter/:critter_id/marking -> all markings of a critter
//TODO GET critter/:critter_id/marking/:marking_id -> marking of a critter
//TODO GET critter/:critter_id/measurements/qualitative -> all qualitative measurements of a critter
//TODO GET critter/:critter_id/measurements/qualitative/{qualitative_id} -> qualitative measurement of a critter
//TODO GET critter/:critter_id/captures
//TODO GET critter/:critter_id/captures/:capture_id
//TODO GET critter/:critter_id/captures/:capture_id/capture-location
//TODO GET critter/:critter_id/captures/:capture_id/release-location
//TODO GET critter/:critter_id/mortality
//TODO GET critter/:critter_id/mortality/:mortality_id/mortality-location
//TODO GET critter/:critter_id/collection-unit

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
      critterFormatOptions
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
    const parsed = CritterCreateSchema.parse(req.body);
    const created = await formatParse(
      getFormat(req),
      createCritter(parsed, getFormat(req)),
      critterFormatOptions
    );
    return res.status(201).send(created);
  })
);

critterRouter.route("/wlh/:wlh_id").get(
  catchErrors(async (req: Request, res: Response) => {
    // const critters = await getCritterByWlhId(req.params.wlh_id);
    const critters = await formatParse<CritterParse>(
      getFormat(req),
      getCritterByWlhId(req.params.wlh_id, getFormat(req)),
      critterFormatOptions
    );
    if (Array.isArray(critters) && !critters.length) {
      throw apiError.notFound(
        "Could not find any animals with the requested WLH ID"
      );
    }
    // const format = critters.map((c) => CritterDetailedResponseSchema.parse(c));
    return res.status(200).json(critters);
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
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const critter = await formatParse(
        getFormat(req),
        getCritterByIdWithDetails(id, getFormat(req)),
        critterFormatOptions
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
        critterFormatOptions
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
        critterFormatOptions
      );
      res.status(200).json(critter);
    })
  );
