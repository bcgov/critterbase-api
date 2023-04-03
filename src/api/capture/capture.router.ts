import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  createCapture,
  deleteCapture,
  getAllCaptures,
  getCaptureByCritter,
  getCaptureById,
  updateCapture,
} from "./capture.service";

import {
  CaptureCreateSchema,
  CaptureResponseSchema,
  CaptureUpdateSchema,
} from "./capture.utils";
import { uuidParamsSchema } from "../../utils/zod_helpers";

export const captureRouter = express.Router();

/**
 ** Critter Router Home
 */
captureRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const allCritters = await getAllCaptures();
    return res.status(200).json(allCritters);
  })
);

/**
 ** Create new critter
 */
captureRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const parsed = CaptureCreateSchema.parse(req.body);
    const result = await createCapture(parsed);
    return res.status(201).json(result);
  })
);

captureRouter.get(
  "/critter/:id",
  catchErrors(async (req: Request, res: Response) => {
    const parsed = uuidParamsSchema.parse(req.params);
    const result = await getCaptureByCritter(parsed.id);
    const format = result?.map((c) => CaptureResponseSchema.parse(c));
    res.status(200).json(format);
  })
);

/**
 * * All critter_id related routes
 */
captureRouter
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
      const result = await getCaptureById(id);
      const format = CaptureResponseSchema.parse(result);
      return res.status(200).json(format);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const parsed = CaptureUpdateSchema.parse(req.body);
      const result = await updateCapture(id, parsed);
      res.status(200).json(result);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const result = await deleteCapture(id);
      res.status(200).json(result);
    })
  );
