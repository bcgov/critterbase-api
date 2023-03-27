import * as z from "zod"
import { Completeartifact, RelatedartifactSchema, Completexref_taxon_measurement_qualitative_option, Relatedxref_taxon_measurement_qualitative_optionSchema, Completeuser, RelateduserSchema, Completecritter, RelatedcritterSchema, Completecapture, RelatedcaptureSchema } from "./index"

export const measurement_qualitativeSchema = z.object({
  measurement_qualitative_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  taxon_measurement_id: z.string().uuid(),
  capture_id: z.string().uuid().nullish(),
  mortality_id: z.string().uuid().nullish(),
  qualitative_option_id: z.string().uuid(),
  measurement_comment: z.string().nullish(),
  measured_timestamp: z.date().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completemeasurement_qualitative extends z.infer<typeof measurement_qualitativeSchema> {
  artifact_artifact_measurement_qualitativeTomeasurement_qualitative: Completeartifact[]
  xref_taxon_measurement_qualitative_option: Completexref_taxon_measurement_qualitative_option
  user_measurement_qualitative_create_userTouser: Completeuser
  user_measurement_qualitative_update_userTouser: Completeuser
  critter: Completecritter
  capture_idTocapture?: Completecapture | null
}

/**
 * Relatedmeasurement_qualitativeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedmeasurement_qualitativeSchema: z.ZodSchema<Completemeasurement_qualitative> = z.lazy(() => measurement_qualitativeSchema.extend({
  artifact_artifact_measurement_qualitativeTomeasurement_qualitative: RelatedartifactSchema.array(),
  xref_taxon_measurement_qualitative_option: Relatedxref_taxon_measurement_qualitative_optionSchema,
  user_measurement_qualitative_create_userTouser: RelateduserSchema,
  user_measurement_qualitative_update_userTouser: RelateduserSchema,
  critter: RelatedcritterSchema,
  capture_idTocapture: RelatedcaptureSchema.nullish(),
}))
