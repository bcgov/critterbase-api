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
} from "./artifact.types";
import { uuidParamsSchema } from "../../utils/zod_schemas";
import { apiError } from "../../utils/types";
import { strings } from "../../utils/constants";

export const artifactRouter = express.Router();

/**
 ** Artifact Router Home
 */
artifactRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const artifacts = await getAllArtifacts();
    return res.status(200).json(artifacts);
  })
);

/**
 ** Create new artifact
 */
artifactRouter.post(
  "/create",
  catchErrors(async (req: Request, res: Response) => {
    const artifactData = await ArtifactCreateBodySchema.parseAsync(req.body);
    const newArtifact = await createArtifact(artifactData);
    return res.status(201).json(newArtifact);
  })
);

/**
 ** Get artifacts with a critter_id
 */
artifactRouter.route("/critter/:id").get(
  catchErrors(async (req: Request, res: Response) => {
    // validate critter id and confirm that markings exists
    const { id } = uuidParamsSchema.parse(req.params);
    const artifacts = await getArtifactsByCritterId(id);
    if (!artifacts.length) {
      throw apiError.notFound(`Critter ID "${id}" has no associated artifacts`);
    }
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
      // validate artifact id and confirm that artifact exists
      const { id } = uuidParamsSchema.parse(req.params);
      res.locals.artifactData = await getArtifactById(id);
      if (!res.locals.artifactData) {
        throw apiError.notFound(strings.artifact.notFound);
      }
      next();
    })
  )
  .get(
    catchErrors(async (req: Request, res: Response) => {
      // using stored data from validation to avoid duplicate query
      return res.status(200).json(res.locals.artifactData);
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
