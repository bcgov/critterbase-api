import { string, z } from "zod";
import { nonEmpty } from "../../utils/zod_helpers";

const ArtifactCreateBodySchema = z.object({
  critter_id: string().uuid(),
  artifact_url: string().url(),
  artifact_comment: string().optional(),
  capture_id: string().uuid().optional(),
  mortality_id: string().uuid().optional(),
  measurement_qualitative: string().uuid().optional(),
  measurement_quantitative: string().uuid().optional(),
});

const ArtifactUpdateBodySchema = ArtifactCreateBodySchema.partial().refine(
  nonEmpty,
  "no new data was provided or the format was invalid"
);

type ArtifactCreate = z.infer<typeof ArtifactCreateBodySchema>;
type ArtifactUpdate = z.infer<typeof ArtifactUpdateBodySchema>;

export { ArtifactCreateBodySchema, ArtifactUpdateBodySchema };
export type { ArtifactCreate, ArtifactUpdate };
