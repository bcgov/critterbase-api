import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  createArtifact,
  deleteArtifact,
  getAllArtifacts,
  getArtifactById,
  getArtifactsByCritterId,
  updateArtifact,
} from "./artifact.service";
import {
  ArtifactCreateBodySchema,
  ArtifactUpdateBodySchema,
} from "./artifact.utils";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import { apiError } from "../../utils/types";
import { getCritterById } from "../critter/critter.service";
import { prisma } from "../../utils/constants";

export const artifactRouter = express.Router();

/**
 ** Artifact Router Home
 */
artifactRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(200).json(await getAllArtifacts());
  })
);

/**
 ** Create new artifact
 */
artifactRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const artifactData = await ArtifactCreateBodySchema.parse(req.body);
    const newArtifact = await createArtifact(artifactData);
    return res.status(201).json(newArtifact);
  })
);

/**
 ** Get artifacts with a critter_id
 */
artifactRouter.route("/critter/:id").get(
  catchErrors(async (req: Request, res: Response) => {
    // validate uuid and confirm that critter_id exists
    const { id } = uuidParamsSchema.parse(req.params);
    await prisma.critter.findUniqueOrThrow({
      where: { critter_id: id },
    });
    const artifacts = await getArtifactsByCritterId(id);
    return res.status(200).json(artifacts);
  })
);

/**
 ** All artifact_id related routes
 */
artifactRouter
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
      return res.status(200).json(await getArtifactById(req.params.id));
    })
  )
  .patch(
    catchErrors(async (req: Request, res: Response) => {
      const artifactData = await ArtifactUpdateBodySchema.parseAsync(req.body);
      const artifact = await updateArtifact(req.params.id, artifactData);
      return res.status(200).json(artifact);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      await deleteArtifact(id);
      return res.status(200).json(`Artifact ${id} has been deleted`);
    })
  );
