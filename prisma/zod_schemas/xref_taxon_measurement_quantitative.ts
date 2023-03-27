import * as z from "zod"
import { measurement_unit } from "@prisma/client"
import { Completemeasurement_quantitative, Relatedmeasurement_quantitativeSchema, Completeuser, RelateduserSchema, Completelk_taxon, Relatedlk_taxonSchema } from "./index"

export const xref_taxon_measurement_quantitativeSchema = z.object({
  taxon_measurement_id: z.string().uuid(),
  taxon_id: z.string().uuid(),
  measurement_name: z.string(),
  measurement_desc: z.string().nullish(),
  min_value: z.number().nullish(),
  max_value: z.number().nullish(),
  unit: z.nativeEnum(measurement_unit).nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completexref_taxon_measurement_quantitative extends z.infer<typeof xref_taxon_measurement_quantitativeSchema> {
  measurement_quantitative: Completemeasurement_quantitative[]
  user_xref_taxon_measurement_quantitative_create_userTouser: Completeuser
  user_xref_taxon_measurement_quantitative_update_userTouser: Completeuser
  lk_taxon: Completelk_taxon
}

/**
 * Relatedxref_taxon_measurement_quantitativeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedxref_taxon_measurement_quantitativeSchema: z.ZodSchema<Completexref_taxon_measurement_quantitative> = z.lazy(() => xref_taxon_measurement_quantitativeSchema.extend({
  measurement_quantitative: Relatedmeasurement_quantitativeSchema.array(),
  user_xref_taxon_measurement_quantitative_create_userTouser: RelateduserSchema,
  user_xref_taxon_measurement_quantitative_update_userTouser: RelateduserSchema,
  lk_taxon: Relatedlk_taxonSchema,
}))
