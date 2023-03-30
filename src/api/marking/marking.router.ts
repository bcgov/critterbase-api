import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  createMarking,
  deleteMarking,
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
} from "./marking.service";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  MarkingCreateBodySchema,
  markingResponseSchema,
  MarkingUpdateBodySchema,
} from "./marking.types";
import { array } from "zod";
import { getCritterById } from "../critter/critter.service";

export const markingRouter = express.Router();

/**
 ** Marking Router Home
 */
markingRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    return res
      .status(200)
      .json(array(markingResponseSchema).parse(await getAllMarkings()));
  })
);

/**
 ** Create new marking
 */
markingRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const markingData = MarkingCreateBodySchema.parse(req.body);
    const newMarking = markingResponseSchema.parse(
      await createMarking(markingData)
    );
    return res.status(201).json(newMarking);
  })
);

markingRouter.route("/critter/:id").get(
  catchErrors(async (req: Request, res: Response) => {
    // validate uuid and confirm that critter_id exists
    const { id } = uuidParamsSchema.parse(req.params);
    await getCritterById(id);
    const markings = await getMarkingsByCritterId(id);
    return res.status(200).json(array(markingResponseSchema).parse(markings));
  })
);

/**
 ** All marking_id related routes
 */
markingRouter
  .route("/:id")
  .all(
    catchErrors(async (req: Request, res: Response, next: NextFunction) => {
      // validate uuid
      uuidParamsSchema.parse(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      return res
        .status(200)
        .json(markingResponseSchema.parse(await getMarkingById(req.params.id)));
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const markingData = MarkingUpdateBodySchema.parse(req.body);
      const updatedMarking = markingResponseSchema.parse(
        await updateMarking(req.params.id, markingData)
      );
      return res.status(200).json(updatedMarking);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      await deleteMarking(id);
      return res.status(200).json(`Marking ${id} has been deleted`);
    })
  );
