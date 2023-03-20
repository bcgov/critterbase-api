import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  createMarking,
  CreateMarkingSchema,
  deleteMarking,
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
  UpdateMarkingSchema,
} from "./marking.service";
import { apiError } from "../../utils/types";
import { uuidParamsSchema } from "../../utils/zod_schemas";
import { strings } from "../../utils/constants";

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
    const markingData = CreateMarkingSchema.parse(req.body);
    const newMarking = await createMarking(markingData);
    return res.status(201).json(newMarking);
  })
);

markingRouter.route("/critter/:id").get(
  catchErrors(async (req: Request, res: Response) => {
    // validate marking id and confirm that marking exists
    const { id } = uuidParamsSchema.parse(req.params);
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
      const {id} = uuidParamsSchema.parse(req.params);
      res.locals.markingData = await getMarkingById(id);
      if (!res.locals.markingData) {
        throw apiError.notFound(strings.marking.notFound);
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
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const markingData = UpdateMarkingSchema.parse(req.body);
      const marking = await updateMarking(req.params.id, markingData);
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
