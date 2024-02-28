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

type ArtifactResponse = artifact & { signed_url: string };

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

// Validate outgoing response for artifacts
const SwagArtifactResponseSchema = implement<ArtifactResponse>().with({
  ...artifactSchema.shape,
  signed_url: z.string(),
});

// Validate incoming request body for create artifact
const ArtifactCreateBodySchema = implement<
  Omit<
    Prisma.artifactCreateManyInput,
    AuditColumns | "artifact_id" | "artifact_url"
  >
>().with(
  artifactSchema
    .omit({ ...noAudit, artifact_id: true, artifact_url: true })
    .partial()
    .required({ critter_id: true }).shape
);

// Validate incoming request body for update artifact
// * Note: artifact_url and artifact_id are not allowed to be updated
const ArtifactUpdateBodySchema = implement<
  Omit<
    Prisma.artifactUncheckedUpdateManyInput,
    "artifact_url" | "artifact_id" | AuditColumns
  >
>()
  .with(ArtifactCreateBodySchema.partial().shape)
  .refine(nonEmpty, "no new data was provided or the format was invalid");

export {
  artifactSchema,
  ArtifactCreateBodySchema,
  ArtifactUpdateBodySchema,
  SwagArtifactResponseSchema,
};
export type { ArtifactCreate, ArtifactUpdate, ArtifactResponse };
