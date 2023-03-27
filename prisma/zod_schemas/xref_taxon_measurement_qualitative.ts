import * as z from "zod"
import { Completeuser, RelateduserSchema, Completelk_taxon, Relatedlk_taxonSchema, Completexref_taxon_measurement_qualitative_option, Relatedxref_taxon_measurement_qualitative_optionSchema } from "./index"

export const xref_taxon_measurement_qualitativeSchema = z.object({
  taxon_measurement_id: z.string().uuid(),
  taxon_id: z.string().uuid(),
  measurement_name: z.string(),
  measurement_desc: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completexref_taxon_measurement_qualitative extends z.infer<typeof xref_taxon_measurement_qualitativeSchema> {
  user_xref_taxon_measurement_qualitative_create_userTouser: Completeuser
  lk_taxon: Completelk_taxon
  user_xref_taxon_measurement_qualitative_update_userTouser: Completeuser
  xref_taxon_measurement_qualitative_option: Completexref_taxon_measurement_qualitative_option[]
}

/**
 * Relatedxref_taxon_measurement_qualitativeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedxref_taxon_measurement_qualitativeSchema: z.ZodSchema<Completexref_taxon_measurement_qualitative> = z.lazy(() => xref_taxon_measurement_qualitativeSchema.extend({
  user_xref_taxon_measurement_qualitative_create_userTouser: RelateduserSchema,
  lk_taxon: Relatedlk_taxonSchema,
  user_xref_taxon_measurement_qualitative_update_userTouser: RelateduserSchema,
  xref_taxon_measurement_qualitative_option: Relatedxref_taxon_measurement_qualitative_optionSchema.array(),
}))
