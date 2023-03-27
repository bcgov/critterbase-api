import * as z from "zod"
import { Completeuser, RelateduserSchema, Completecritter, RelatedcritterSchema, Completemeasurement_qualitative, Relatedmeasurement_qualitativeSchema, Completemeasurement_quantitative, Relatedmeasurement_quantitativeSchema } from "./index"

export const artifactSchema = z.object({
  artifact_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  artifact_url: z.string(),
  artifact_comment: z.string().nullish(),
  capture_id: z.string().uuid().nullish(),
  mortality_id: z.string().uuid().nullish(),
  measurement_qualitative: z.string().uuid().nullish(),
  measurement_quantitative: z.string().uuid().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completeartifact extends z.infer<typeof artifactSchema> {
  user_artifact_create_userTouser: Completeuser
  critter: Completecritter
  measurement_qualitative_artifact_measurement_qualitativeTomeasurement_qualitative?: Completemeasurement_qualitative | null
  measurement_quantitative_artifact_measurement_quantitativeTomeasurement_quantitative?: Completemeasurement_quantitative | null
  user_artifact_update_userTouser: Completeuser
}

/**
 * RelatedartifactSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedartifactSchema: z.ZodSchema<Completeartifact> = z.lazy(() => artifactSchema.extend({
  user_artifact_create_userTouser: RelateduserSchema,
  critter: RelatedcritterSchema,
  measurement_qualitative_artifact_measurement_qualitativeTomeasurement_qualitative: Relatedmeasurement_qualitativeSchema.nullish(),
  measurement_quantitative_artifact_measurement_quantitativeTomeasurement_quantitative: Relatedmeasurement_quantitativeSchema.nullish(),
  user_artifact_update_userTouser: RelateduserSchema,
}))
