import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  appendEnglishMarkingsAsUUID,
  createMarking,
  deleteMarking,
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
} from "./marking.service";
import { critterIdSchema, uuidParamsSchema } from "../../utils/zod_helpers";
import {
  MarkingCreateBodySchema,
  MarkingCreateWithEnglishSchema,
  markingResponseSchema,
  MarkingUpdateBodySchema,
} from "./marking.utils";
import { array, z } from "zod";
import { prisma } from "../../utils/constants";
import { getCritterById } from "../critter/critter.service";
import { QueryFormats } from "../../utils/types";
import console from "console";

export const markingRouter = express.Router();

/**
 ** Marking Router Home
 */
markingRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const markings = await getAllMarkings();
    const formattedMarkings = array(markingResponseSchema).parse(markings);
    return res.status(200).json(formattedMarkings);
  })
);

/**
 ** Create new marking
 */
markingRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const markingData = await MarkingCreateBodySchema.parseAsync(req.body);
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
    await prisma.critter.findUniqueOrThrow({
      where: { critter_id: id },
    });
    const markings = await getMarkingsByCritterId(id);
    const formattedMarkings = array(markingResponseSchema).parse(markings);
    return res.status(200).json(formattedMarkings);
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
      await uuidParamsSchema.parseAsync(req.params);
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      const marking = await getMarkingById(req.params.id);
      const formattedMarking = markingResponseSchema.parse(marking);
      return res.status(200).json(formattedMarking);
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const markingData = await MarkingUpdateBodySchema.parseAsync(req.body);
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
