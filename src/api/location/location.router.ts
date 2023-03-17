import express, { NextFunction, Request, Response } from "express";
import { strings } from "../../utils/constants";
import { isUUID } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { apiError } from "../../utils/types";
import { uuidParamsSchema } from "../../utils/zod_schemas";
import {
  createLocation,
  deleteLocation,
  getAllLocations,
  getLocation,
  LocationCreateBodySchema,
  LocationUpdateBodySchema,
  updateLocation,
} from "./location.service";

export const locationRouter = express.Router();

/**
 ** Get all locations
 */
locationRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const locations = await getAllLocations();
    if (!locations || !locations?.length) {
      throw apiError.notFound(strings.location.notFoundMulti);
    }
    return res.status(200).json(locations);
  })
);

/**
 ** Create new location
 */
locationRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    LocationCreateBodySchema.parse(req.body);
    const location = await createLocation(req.body);
    return res.status(201).json(location);
  })
);

/**
 * * All location_id related routes
 */
locationRouter
  .route("/:id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      uuidParamsSchema.parse(req.params);
      const location = await getLocation(req.params.id);
      if (!location) {
        throw apiError.notFound(strings.location.notFound);
      }
      res.locals.location = location;
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      return res.status(200).json(res.locals.location);
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      LocationUpdateBodySchema.parse(req.body);
      const location = await updateLocation(req.body);
      res.status(200).json(location);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      await deleteLocation(id);
      res.status(200).json(strings.location.deleted(id));
    })
  );
