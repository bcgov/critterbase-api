import express, { NextFunction, Request, Response } from 'express';
import { array } from 'zod';
import { catchErrors } from '../../utils/middleware';
import { uuidParamsSchema } from '../../utils/zod_helpers';
import { LocationCreateSchema, LocationResponseSchema } from './location.utils';
import { ICbDatabase } from '../../utils/database';

export const LocationRouter = (db: ICbDatabase) => {
  const locationRouter = express.Router();

  /**
   ** Get all locations
   */
  locationRouter.get(
    '/',
    catchErrors(async (req: Request, res: Response) => {
      const locations = await db.getAllLocations();
      const formattedLocations = array(LocationResponseSchema).parse(locations);
      return res.status(200).json(formattedLocations);
    })
  );

  /**
   ** Create new location
   */
  locationRouter.post(
    '/create',
    catchErrors(async (req: Request, res: Response) => {
      const parsed = LocationCreateSchema.parse(req.body);
      const location = await db.createLocation(parsed);
      return res.status(201).json(location);
    })
  );

  /**
   * * All location_id related routes
   */
  locationRouter
    .route('/:id')
    .all(
      catchErrors(async (req: Request, res: Response, next: NextFunction) => {
        await uuidParamsSchema.parseAsync(req.params);
        next();
      })
    )
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const location = await db.getLocationOrThrow(req.params.id);
        const formattedLocation = LocationResponseSchema.parse(location);
        return res.status(200).json(formattedLocation);
      })
    )
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const parsedBody = LocationCreateSchema.parse(req.body);
        const location = await db.updateLocation(parsedBody, req.params.id);
        res.status(201).json(location);
      })
    )
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const location = await db.deleteLocation(req.params.id);
        res.status(200).json(location);
      })
    );

  return locationRouter;
};
