import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { getCritter } from "./critter.service";
import { cError } from "../../utils/global_types";

export const critterRouter = express.Router();

/**
 ** Critter Router Home
 */
critterRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(200).json("Critter Router");
  })
);

/**
 ** Create new critter
 */
critterRouter.post(
  "/new",
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
        throw new cError("Critter ID not found", 404);
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const critter = getCritter();
      return res.status(200).json(critter);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      return res.status(200).json(`Update critter ${id}`);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      return res.status(200).json(`Delete critter ${id}`);
    })
  );
