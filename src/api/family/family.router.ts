import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { getAllChildren, getAllFamilies, getAllParents } from "./familyservice";
import { apiError } from "../../utils/types";

export const familyRouter = express.Router();

/**
 ** Critter Router Home
 */
 familyRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const families = getAllFamilies();
    return res.status(200).json(families);
  })
);

/**
 ** Create new critter
 */
 familyRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(201).json(`Post new critter`);
  })
);

familyRouter
  .get("/family")
  catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const families = await getAllFamilies();
    return res.status(200).send(families);
  });

familyRouter
  .get("/child")
  catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const children = await getAllChildren();
    return res.status(200).send(children);
  });

familyRouter
  .get("/parents")
  catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const parents = await getAllParents();
    return res.status(200).send(parents);
  });

/**
 * * All critter_id related routes
 */
familyRouter
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
