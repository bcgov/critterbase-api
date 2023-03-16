import express, { NextFunction, Request, Response } from "express";
import { STR } from "../../utils/constants";
import { catchErrors } from "../../utils/middleware";
import { apiError } from "../../utils/types";
import {
  getAllLocations,
  getLocation,
  deleteLocation,
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
      throw apiError.notFound(STR.location.notFoundMulti);
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
    return res.status(201).json(`Post new location`);
  })
);

/**
 * * All location_id related routes
 */
locationRouter
  .route("/:id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      if (!id) {
        throw apiError.syntaxIssue(STR.location.noID);
      }
      const location = await getLocation(id);
      if (!location) {
        throw apiError.notFound(STR.location.notFound);
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
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      res.status(200).json(`Update location ${id}`);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      deleteLocation(id);
      res.status(200).json(`Delete location ${id}`);
    })
  );
