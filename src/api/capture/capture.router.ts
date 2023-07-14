import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  CaptureCreateSchema,
  CaptureResponseSchema,
  CaptureUpdateSchema,
} from "./capture.utils";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import { ICbDatabase } from "../../utils/database";

export const CaptureRouter = (db: ICbDatabase) => {
  const captureRouter = express.Router();

  /**
   ** Critter Router Home
   */
  captureRouter.get(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      const allCaptures = await db.getAllCaptures();
      const result = allCaptures.map((c) => CaptureResponseSchema.parse(c));
      return res.status(200).json(result);
    })
  );

  /**
   ** Create new critter
   */
  captureRouter.post(
    "/create",
    catchErrors(async (req: Request, res: Response) => {
      const parsed = CaptureCreateSchema.parse(req.body);
      const result = await db.createCapture(parsed);
      return res.status(201).json(result);
    })
  );

  captureRouter.get(
    "/critter/:id",
    catchErrors(async (req: Request, res: Response) => {
      const parsed = uuidParamsSchema.parse(req.params);
      const result = await db.getCaptureByCritter(parsed.id);
      const format = result.map((c) => CaptureResponseSchema.parse(c));
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
        const result = await db.getCaptureById(id);
        const format = CaptureResponseSchema.parse(result);
        return res.status(200).json(format);
      })
    )
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const parsed = CaptureUpdateSchema.parse(req.body);
        const result = await db.updateCapture(id, parsed);
        res.status(200).json(result);
      })
    )
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await db.deleteCapture(id);
        res.status(200).json(result);
      })
    );

  return captureRouter;
};
