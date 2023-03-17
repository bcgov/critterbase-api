import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  createMarking,
  deleteMarking,
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  isValidCreateMarkingInput,
  isValidUpdateMarkingInput,
  updateMarking,
} from "./marking.service";
import { apiError } from "../../utils/types";
import { isUUID } from "../../utils/helper_functions";

export const markingRouter = express.Router();

/**
 ** Marking Router Home
 */
markingRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const markings = await getAllMarkings();
    return res.status(200).json(markings);
  })
);

/**
 ** Create new marking
 */
markingRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const markingData = req.body;
    if (!isValidCreateMarkingInput(markingData)) {
      throw apiError.syntaxIssue("Invalid request body");
    }
    const newMarking = await createMarking(markingData);
    return res.status(201).json(newMarking);
  })
);

markingRouter.route("/critter/:id").get(
  catchErrors(async (req: Request, res: Response) => {
    // validate marking id and confirm that marking exists
    const id = isUUID(req.params.id);
    const markings = await getMarkingsByCritterId(id);
    if (!markings.length) {
      throw apiError.notFound(`Critter ID "${id}" has no associated markings`);
    }
    return res.status(200).json(markings);
  })
);

/**
 ** All marking_id related routes
 */
markingRouter
  .route("/:id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      // validate marking id and confirm that marking exists
      const id = isUUID(req.params.id);
      res.locals.markingData = await getMarkingById(id);
      if (!res.locals.markingData) {
        throw apiError.notFound(`Marking ID "${id}" not found`);
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      // using stored data from validation to avoid duplicate query
      return res.status(200).json(res.locals.markingData);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      if (!isValidUpdateMarkingInput(req.body)) {
        throw apiError.syntaxIssue("Invalid request body");
      }
      const marking = await updateMarking(id, req.body);
      return res.status(200).json(marking);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      await deleteMarking(id);
      return res.status(200).json(`Marking ${id} has been deleted`);
    })
  );
