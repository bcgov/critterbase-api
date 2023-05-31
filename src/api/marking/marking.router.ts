import type { Request, Response } from "express";
import express, { NextFunction } from "express";
import { array } from "zod";
import { prisma } from "../../utils/constants";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  createMarking,
  deleteMarking,
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
  verifyMarkingsAgainstTaxon,
} from "./marking.service";
import {
  MarkingCreateBodySchema,
  MarkingUpdateBodySchema,
  MarkingVerificationSchema,
  markingResponseSchema,
} from "./marking.utils";

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

markingRouter.post("/verify",
  catchErrors(async (req: Request, res: Response) => {
    const parsed = MarkingVerificationSchema.parse(req.body);
    const problems = await verifyMarkingsAgainstTaxon(parsed.taxon_id, parsed.markings);
    return res.status(200).json(problems);
  }
));

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
