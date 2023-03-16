import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { getAllCaptures } from "./capture.service";
import { apiError } from "../../utils/types";
import { prisma } from "../../utils/constants";

export const captureRouter = express.Router();

/**
 ** Critter Router Home
 */
 captureRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const allCritters = getAllCaptures();
    return res.status(200).json(allCritters);
  })
);

/**
 ** Create new critter
 */
 captureRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(201).json(`Post new critter`);
  })
);

captureRouter.get(
  "/critter/:critter_id",
  catchErrors(async (req: Request, res: Response) => {
    const id = req.params.critter_id;
    const result = prisma.capture.findMany({
      where: {
        critter_id: id
      }
    })
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
      const result = prisma.capture.findFirst({
        where: {
          capture_id: id
        }
      })
      if(!result) {
        throw apiError.notFound('Could not find the requested capture')
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.capture_id;
      const result = prisma.capture.findUnique({
        where: {
          capture_id: id
        }
      })
      return res.status(200).json(result);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      res.status(200).json(`Update critter ${id}`);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      res.status(200).json(`Delete critter ${id}`);
    })
  );
