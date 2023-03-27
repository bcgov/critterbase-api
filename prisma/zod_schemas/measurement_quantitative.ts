import * as z from "zod"
import { Completeartifact, RelatedartifactSchema, Completecritter, RelatedcritterSchema, Completexref_taxon_measurement_quantitative, Relatedxref_taxon_measurement_quantitativeSchema, Completecapture, RelatedcaptureSchema } from "./index"

export const measurement_quantitativeSchema = z.object({
  measurement_quantitative_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  taxon_measurement_id: z.string().uuid(),
  capture_id: z.string().uuid().nullish(),
  mortality_id: z.string().uuid().nullish(),
  value: z.number(),
  measurement_comment: z.string().nullish(),
  measured_timestamp: z.date().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completemeasurement_quantitative extends z.infer<typeof measurement_quantitativeSchema> {
  artifact_artifact_measurement_quantitativeTomeasurement_quantitative: Completeartifact[]
  critter: Completecritter
  xref_taxon_measurement_quantitative: Completexref_taxon_measurement_quantitative
  capture_idTocapture?: Completecapture | null
}

/**
 * Relatedmeasurement_quantitativeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedmeasurement_quantitativeSchema: z.ZodSchema<Completemeasurement_quantitative> = z.lazy(() => measurement_quantitativeSchema.extend({
  artifact_artifact_measurement_quantitativeTomeasurement_quantitative: RelatedartifactSchema.array(),
  critter: RelatedcritterSchema,
  xref_taxon_measurement_quantitative: Relatedxref_taxon_measurement_quantitativeSchema,
  capture_idTocapture: RelatedcaptureSchema.nullish(),
}))
