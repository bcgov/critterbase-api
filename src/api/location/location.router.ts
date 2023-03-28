import express, { NextFunction, Request, Response } from "express";
import { strings } from "../../utils/constants";
import { isUUID } from "../../utils/helper_functions";
import { catchErrors } from "../../utils/middleware";
import { apiError } from "../../utils/types";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  createLocation,
  deleteLocation,
  getAllLocations,
  getLocationOrThrow,
  updateLocation,
} from "./location.service";
import { LocationCreateSchema } from "./location.types";

export const locationRouter = express.Router();

/**
 ** Get all locations
 */
locationRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const locations = await getAllLocations();
    return res.status(200).json(locations);
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
      return res.status(200).json(location);
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const updateBody = LocationCreateSchema.parse(req.body);
      const location = await updateLocation(updateBody, id);
      res.status(201).json(location);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      await deleteLocation(id);
      res.status(200).json(strings.location.deleted(id));
    })
  );
