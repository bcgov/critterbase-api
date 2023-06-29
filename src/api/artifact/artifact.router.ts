import express, { NextFunction } from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import {
  ArtifactCreateBodySchema,
  ArtifactUpdateBodySchema,
} from "./artifact.utils";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import { ICbDatabase } from "../../utils/database";
import {
  uploadFileToS3,
  getFileDownloadUrl,
  upload,
} from "../../utils/object_store";
import { randomUUID } from "crypto";

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
   ** Artifact file is uploaded to S3 (Object Store) and the artifact_url is stored in the database
   ** Files are stored in a flat structure in the root of the bucket
   ** The file names follow the pattern: <artifact_id>_<original_file_name>.<file_extension>
   ** Because the files are stored in the root of the bucket, the artifact_url is simply the file name
   */
  artifactRouter.post(
    "/create",
    upload.single("artifact"), // 'artifact' should match the 'name' attribute in your form input
    catchErrors(async (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      // TODO: user and timestamp metadata could be added here, but this is redundant with the database
      const metadata = {
        filename: req.file.originalname,
      };
      const artifact_id = randomUUID();
      const artifactUrl = await uploadFileToS3(req.file, artifact_id, metadata);
      const artifactData = ArtifactCreateBodySchema.parse({
        ...req.body,
        artifact_id,
        artifact_url: artifactUrl,
      });
      const newArtifact = await db.createArtifact(artifactData);
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
