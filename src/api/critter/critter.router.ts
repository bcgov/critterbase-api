/* eslint-disable @typescript-eslint/require-await */
import express, { NextFunction, Request, Response } from "express";
import { getFormat } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";

import { CritterIdsRequestSchema, CritterQuerySchema } from "./critter.utils";
import { ICbDatabase } from "../../utils/database";
import {
  CritterCreateSchema,
  CritterUpdateSchema,
  SimilarCritterQuerySchema,
} from "../../schemas/critter-schema";

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

      const response = await service.getAllCrittersOrCrittersWithWlhId(wlh_id);

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

      const response = await service.getMultipleCrittersByIds(critter_ids);

      return res.status(200).json(response);
    }),
  );

  /**
   * Find critters by semi-unique attributes.
   *
   */
  critterRouter.post(
    "/unique",
    catchErrors(async (req: Request, res: Response) => {
      const parsed = SimilarCritterQuerySchema.parse(req.body);

      const service = new db.CritterService();

      const response = await service.findSimilarCritters(parsed);

      return res.status(200).json(response);
    }),
  );

  /**
   * Create a new critter
   *
   */
  critterRouter.post(
    "/create",
    catchErrors(async (req: Request, res: Response) => {
      const payload = CritterCreateSchema.parse(req.body);

      const service = new db.CritterService();

      const response = await service.createCritter(payload);

      return res.status(201).send(response);
    }),
  );

  /**
   * All critter id related routes
   * Note: Parsing critter id at top level.
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
