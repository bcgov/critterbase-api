import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  ArtifactCreateBodySchema,
  ArtifactUpdateBodySchema,
} from "./artifact.utils";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import { ICbDatabase } from "../../utils/database";
import { upload } from "../../utils/object_store";

// TODO: Returned signed URLs or files from get requests
export const ArtifactRouter = (db: ICbDatabase) => {
  const artifactRouter = express.Router();

  /**
   ** Artifact Router Home
   */
  artifactRouter.get(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      return res.status(200).json(await db.getAllArtifacts());
    })
  );

  /**
   ** Create new artifact
   */
  artifactRouter.post(
    "/create",
    upload.single("artifact"), // 'artifact' should match the 'name' attribute in your form input
    catchErrors(async (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const artifactData = ArtifactCreateBodySchema.parse(req.body);
      const newArtifact = await db.createArtifact(artifactData, req.file);
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
      await db.getCritterById(id);
      const artifacts = await db.getArtifactsByCritterId(id);
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
        await uuidParamsSchema.parseAsync(req.params);
        next();
      })
    )
    .get(
      catchErrors(async (req: Request, res: Response) => {
        return res.status(200).json(await db.getArtifactById(req.params.id));
      })
    )
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const artifactData = await ArtifactUpdateBodySchema.parseAsync(
          req.body
        );
        const artifact = await db.updateArtifact(req.params.id, artifactData);
        return res.status(200).json(artifact);
      })
    )
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        await db.deleteArtifact(id);
        return res.status(200).json(`Artifact ${id} has been deleted`);
      })
    );

  return artifactRouter;
};
