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
import { apiError } from "../../utils/types";
import { prisma } from "../../utils/constants";
import {
  CaptureCreateBodySchema,
  CaptureUpdateBodySchema,
} from "./capture.types";
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
    const parsed = CaptureCreateBodySchema.parse(req.body);
    const result = await createCapture(parsed);
    return res.status(201).json(result);
  })
);

captureRouter.get(
  "/critter/:id",
  catchErrors(async (req: Request, res: Response) => {
    const parsed = uuidParamsSchema.parse(req.params);
    const result = await getCaptureByCritter(parsed.id);
    res.status(200).send(result);
  })
);

/**
 * * All critter_id related routes
 */
captureRouter
  .route("/:id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      uuidParamsSchema.parse(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const result = await getCaptureById(id);
      return res.status(200).json(result);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const parsed = CaptureUpdateBodySchema.parse(req.body);
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
