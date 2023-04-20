import type { Request, Response } from "express";
import express, { NextFunction } from "express";
import { catchErrors } from "../../utils/middleware";
import { apiError } from "../../utils/types";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  appendEnglishTaxonAsUUID,
  createCritter,
  deleteCritter,
  getAllCritters,
  getCritterByIdWithDetails,
  getCritterByWlhId,
  getSimilarCritters,
  getTableDataTypes,
  getMultipleCrittersByIds,
  updateCritter,
} from "./critter.service";
import {
  CritterCreateSchema,
  CritterIdsRequestSchema,
  CritterDetailedResponseSchema,
  CritterUpdateSchema,
  CritterSimpleResponseSchema,
} from "./critter.utils";
import { array } from "zod";

export const critterRouter = express.Router();

/**
 ** Critter Router Home
 */
critterRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const allCritters = await getAllCritters();
    return res.status(200).json(allCritters);
  })
);

/**
 ** Fetch multiple critters by their IDs
 */
 critterRouter.post(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const parsed = CritterIdsRequestSchema.parse(req.body);
    const critters = await getMultipleCrittersByIds(parsed);
    return res.status(200).json(array(CritterSimpleResponseSchema).parse(critters));
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
    const created = await createCritter(parsed);
    return res.status(201).send(created);
  })
);

critterRouter.post(
  '/unique',
  catchErrors(async (req: Request, res: Response) => {
    const unique = await getSimilarCritters(req.body);
    console.log(req.body);
    console.log(unique);
    return res.status(200).json(unique);
  })
)

critterRouter.get(
  '/types',
  catchErrors(async (req: Request, res: Response) => {
    const types = await getTableDataTypes();
    return res.status(200).json(types);
  }))

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
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const critter = await getCritterByIdWithDetails(id);
      const format = CritterDetailedResponseSchema.parse(critter);
      return res.status(200).json(format);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const parsed = CritterUpdateSchema.parse(req.body);
      const critter = await updateCritter(id, parsed);
      res.status(200).json(critter);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const critter = await deleteCritter(id);
      res.status(200).json(critter);
    })
  );
