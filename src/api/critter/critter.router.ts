/* eslint-disable @typescript-eslint/require-await */
import express, { NextFunction, Request, Response } from "express";
import { formatParse, getFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { apiError } from "../../utils/types";
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
  CritterIdsRequestSchema,
  CritterQuerySchema,
  CritterUpdateSchema,
  critterFormats,
} from "./critter.utils";

export const critterRouter = express.Router();

/**
 ** Critter Router Home
 */
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
    const parsed = CritterCreateSchema.parse(req.body);
    const created = await formatParse(
      getFormat(req),
      createCritter(parsed, getFormat(req)),
      critterFormats
    );
    return res.status(201).send(created);
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
