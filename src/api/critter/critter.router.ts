import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { getAllCritters } from "./critter.service";
import { apiError } from "../../utils/types";

export const critterRouter = express.Router();

/**
 ** Critter Router Home
 */
 critterRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const allCritters = getAllCritters();
    return res.status(200).json(allCritters);
  })
);

/**
 ** Create new critter
 */
 critterRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(201).json(`Post new critter`);
  })
);

/**
 * * All critter_id related routes
 */
critterRouter
  .route("/:critter_id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      const critter_id = req.params.critter_id;
      //Check if critter exists before running next routes.
      //Temp for testing
      if (!["1", "2", "3"].includes(critter_id)) {
        throw apiError.notFound("Critter ID not found");
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      return res.status(200).json({ hello: "world" });
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
