import express, { NextFunction, Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  createQualMeasurement,
  createQuantMeasurement,
  deleteQualMeasurement,
  deleteQuantMeasurement,
  getAllQualMeasurements,
  getAllQuantMeasurements,
  getQualMeasurementOrThrow,
  getQuantMeasurementOrThrow,
} from "./measurement.service";
import {
  QualitativeCreateSchema,
  QualitativeResponseSchema,
  QuantitativeCreateSchema,
  QuantitativeResponseSchema,
} from "./measurement.utils";

export const measurementRouter = express.Router();

const QUAL_ROUTE = `/qualitative`;
const QUANT_ROUTE = `/quantitative`;
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

/**
 ** Create new qualitative measurement
 */
measurementRouter.post(
  `${QUAL_ROUTE}/create`,
  catchErrors(async (req: Request, res: Response) => {
    QualitativeCreateSchema.parse(req.body);
    const measurement = await createQualMeasurement(req.body);
    return res.status(201).json(measurement);
  })
);

/**
 ** Create new quantitative measurement
 */
measurementRouter.post(
  `${QUANT_ROUTE}/create`,
  catchErrors(async (req: Request, res: Response) => {
    QuantitativeCreateSchema.parse(req.body);
    const measurement = await createQuantMeasurement(req.body);
    return res.status(201).json(measurement);
  })
);

/**
 * * All qualitative measurement id related routes
 */
measurementRouter
  .route(`${QUAL_ROUTE}/:id`)
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      uuidParamsSchema.parse(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const qual = await getQualMeasurementOrThrow(req.params.id);
      const formattedQual = QualitativeResponseSchema.parse(qual);
      return res.status(200).json(formattedQual);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const deleted = await deleteQualMeasurement(id);
      res.status(200).json(deleted);
    })
  );
/**
 * * All quantitative measurement id related routes
 */
measurementRouter
  .route(`${QUANT_ROUTE}/:id`)
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      uuidParamsSchema.parse(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const quant = await getQuantMeasurementOrThrow(req.params.id);
      const formattedQuant = QuantitativeResponseSchema.parse(quant);
      return res.status(200).json(formattedQuant);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const deleted = await deleteQuantMeasurement(id);
      res.status(200).json(deleted);
    })
  );
//   .patch(
//     catchErrors(async (req: Request, res: Response) => {
//       const id = req.params.id;
//       const updateBody = measurementBodySchema.parse(req.body);
//       const measurement = await updatemeasurement(updateBody, id);
//       res.status(201).json(measurement);
//     })
//   )
