import * as z from "zod"
import { Completemeasurement_qualitative, Relatedmeasurement_qualitativeSchema, Completeuser, RelateduserSchema, Completexref_taxon_measurement_qualitative, Relatedxref_taxon_measurement_qualitativeSchema } from "./index"

export const xref_taxon_measurement_qualitative_optionSchema = z.object({
  qualitative_option_id: z.string().uuid(),
  taxon_measurement_id: z.string().uuid(),
  option_label: z.string().nullish(),
  option_value: z.number().int(),
  option_desc: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completexref_taxon_measurement_qualitative_option extends z.infer<typeof xref_taxon_measurement_qualitative_optionSchema> {
  measurement_qualitative: Completemeasurement_qualitative[]
  user_xref_taxon_measurement_qualitative_option_create_userTouser: Completeuser
  user_xref_taxon_measurement_qualitative_option_update_userTouser: Completeuser
  xref_taxon_measurement_qualitative: Completexref_taxon_measurement_qualitative
}

/**
 * Relatedxref_taxon_measurement_qualitative_optionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedxref_taxon_measurement_qualitative_optionSchema: z.ZodSchema<Completexref_taxon_measurement_qualitative_option> = z.lazy(() => xref_taxon_measurement_qualitative_optionSchema.extend({
  measurement_qualitative: Relatedmeasurement_qualitativeSchema.array(),
  user_xref_taxon_measurement_qualitative_option_create_userTouser: RelateduserSchema,
  user_xref_taxon_measurement_qualitative_option_update_userTouser: RelateduserSchema,
  xref_taxon_measurement_qualitative: Relatedxref_taxon_measurement_qualitativeSchema,
}))
