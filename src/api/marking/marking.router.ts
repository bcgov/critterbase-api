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
} from "./marking.utils";
import { array } from "zod";
import { prisma } from "../../utils/constants";
import { getBodyLocationByNameAndTaxonUUID, getColourByName } from "../lookup_helpers/getters";

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
    if(req.body.primary_colour) {
      const col = await getColourByName(req.body.primary_colour);
      req.body.primary_colour_id = col?.colour_id;
    }
    if(req.body.secondary_colour) {
      const col = await getColourByName(req.body.secondary_colour);
      req.body.secondary_colour_id = col?.colour_id;
    }
    if(req.body.body_location) {
      const t = await prisma.critter.findUniqueOrThrow({
        where: { critter_id: req.body.critter_id }
      });
      const taxon_uuid = t.taxon_id;
      const loc = await getBodyLocationByNameAndTaxonUUID(req.body.body_location, taxon_uuid);
      req.body.taxon_marking_body_location_id = loc?.taxon_marking_body_location_id;
    }
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
