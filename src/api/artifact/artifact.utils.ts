import { artifact, Prisma } from ".prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  noAudit,
  nonEmpty,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";

// Types
type ArtifactCreate = z.infer<typeof ArtifactCreateBodySchema>;

type ArtifactUpdate = z.infer<typeof ArtifactUpdateBodySchema>;

// Schemas

// Base schema for all artifacts
const artifactSchema = implement<artifact>().with({
  artifact_id: zodID,
  critter_id: zodID,
  artifact_url: z.string(),
  artifact_comment: z.string().nullable(),
  capture_id: zodID.nullable(),
  mortality_id: zodID.nullable(),
  measurement_qualitative: zodID.nullable(),
  measurement_quantitative: zodID.nullable(),
  ...zodAudit,
});

// Validate incoming request body for create artifact
const ArtifactCreateBodySchema = implement<
  Omit<Prisma.artifactCreateManyInput, keyof AuditColumns>
>().with(
  artifactSchema
    .omit({ ...noAudit })
    .partial()
    .required({ critter_id: true, artifact_url: true }).shape
);

// Validate incoming request body for update artifact
const ArtifactUpdateBodySchema = implement<
  Omit<Prisma.artifactUncheckedUpdateManyInput, keyof AuditColumns>
>()
  .with(ArtifactCreateBodySchema.partial().shape)
  .refine(nonEmpty, "no new data was provided or the format was invalid");

export { artifactSchema, ArtifactCreateBodySchema, ArtifactUpdateBodySchema };
export type { ArtifactCreate, ArtifactUpdate };
