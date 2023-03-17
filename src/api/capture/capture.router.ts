import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { createCapture, deleteCapture, getAllCaptures, getCaptureByCritter, getCaptureById, updateCapture } from "./capture.service";
import { apiError } from "../../utils/types";
import { prisma } from "../../utils/constants";
import { LocationCreateBodySchema, LocationUpdateBodySchema } from "../location/location.service";
import { CaptureCreateBodySchema, CaptureUpdateBodySchema } from "./capture.types";

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
  "/critter/:critter_id",
  catchErrors(async (req: Request, res: Response) => {
    const id = req.params.critter_id;
    const result = await getCaptureByCritter(id);
    res.status(200).send(result);
  })
)

/**
 * * All critter_id related routes
 */
captureRouter
  .route("/:capture_id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.capture_id;
      const result = await prisma.capture.findUnique({
        where: {
          capture_id: id
        }
      })
      if(result == null) {
        throw apiError.notFound('Could not find the requested capture')
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.capture_id;
      const result = await getCaptureById(id);
      console.log(result);
      return res.status(200).json(result);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.capture_id;
      const parsed = CaptureUpdateBodySchema.parse(req.body);
      const result = await updateCapture(id, parsed);
      res.status(200).json(result);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.capture_id;
      const result = await deleteCapture(id);
      res.status(200).json(result);
    })
  );
