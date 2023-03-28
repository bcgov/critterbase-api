import express, { NextFunction, Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  getAllQualMeasurements,
  getAllQuantMeasurements,
  getQualMeasurementOrThrow,
} from "./measurement.service";

export const measurementRouter = express.Router();

/**
 ** Get all measurements
 */
measurementRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const [qualitative, quantitative] = await Promise.all([
      getAllQualMeasurements(),
      getAllQuantMeasurements(),
    ]);
    return res.status(200).json({
      measurements: {
        qualitative,
        quantitative,
      },
    });
  })
);

// /**
//  ** Create new measurement
//  */
// measurementRouter.post(
//   "/qualitative/create",
//   catchErrors(async (req: Request, res: Response) => {
//     measurementBodySchema.parse(req.body);
//     const measurement = await createmeasurement(req.body);
//     return res.status(201).json(measurement);
//   })
// );

/**
 * * All qualitative measurement related routes
 */
measurementRouter
  .route("/qualitative/:id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      uuidParamsSchema.parse(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const qualitative = await getQualMeasurementOrThrow(req.params.id);
      return res.status(200).json(qualitative);
    })
  );
/**
 * * All quantitative measurement related routes
 */
// measurementRouter
//   .route("/quantitative/:id")
//   .all(
//     catchErrors(async (req: Request, res: Response, next: NextFunction) => {
//       uuidParamsSchema.parse(req.params);
//       next();
//     })
//   )
//   .get(
//     catchErrors(async (req: Request, res: Response) => {
//       const quantitative = await getQuantMeasurementOrThrow(req.params.id);
//       return res.status(200).json(quantitative);
//     })
//   );
//   .patch(
//     catchErrors(async (req: Request, res: Response) => {
//       const id = req.params.id;
//       const updateBody = measurementBodySchema.parse(req.body);
//       const measurement = await updatemeasurement(updateBody, id);
//       res.status(201).json(measurement);
//     })
//   )
//   .delete(
//     catchErrors(async (req: Request, res: Response) => {
//       const id = req.params.id;
//       await deletemeasurement(id);
//       res.status(200).json(strings.measurement.deleted(id));
//     })
//   );
