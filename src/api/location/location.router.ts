import express, { NextFunction, Request, Response } from "express";
import { array } from "zod";
import { strings } from "../../utils/constants";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  createLocation,
  deleteLocation,
  getAllLocations,
  getLocationOrThrow,
  updateLocation,
} from "./location.service";
import { LocationCreateSchema, LocationResponseSchema } from "./location.utils";

export const locationRouter = express.Router();

/**
 ** Get all locations
 */
locationRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const locations = await getAllLocations();
    const formattedLocations = array(LocationResponseSchema).parse(locations);
    return res.status(200).json(formattedLocations);
  })
);

/**
 ** Create new location
 */
locationRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    LocationCreateSchema.parse(req.body);
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
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const location = await getLocationOrThrow(req.params.id);
      const formattedLocation = LocationResponseSchema.parse(location);
      return res.status(200).json(formattedLocation);
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const parsedBody = LocationCreateSchema.parse(req.body);
      const location = await updateLocation(parsedBody, req.params.id);
      res.status(201).json(location);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      await deleteLocation(req.params.id);
      res.status(200).json(strings.location.deleted(req.params.id));
    })
  );
