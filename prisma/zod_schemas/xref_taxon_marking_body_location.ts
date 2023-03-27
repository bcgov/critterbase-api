import * as z from "zod"
import { Completemarking, RelatedmarkingSchema, Completeuser, RelateduserSchema, Completelk_taxon, Relatedlk_taxonSchema } from "./index"

export const xref_taxon_marking_body_locationSchema = z.object({
  taxon_marking_body_location_id: z.string().uuid(),
  taxon_id: z.string().uuid(),
  body_location: z.string(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completexref_taxon_marking_body_location extends z.infer<typeof xref_taxon_marking_body_locationSchema> {
  marking: Completemarking[]
  user_xref_taxon_marking_body_location_create_userTouser: Completeuser
  user_xref_taxon_marking_body_location_update_userTouser: Completeuser
  lk_taxon: Completelk_taxon
}

/**
 * Relatedxref_taxon_marking_body_locationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedxref_taxon_marking_body_locationSchema: z.ZodSchema<Completexref_taxon_marking_body_location> = z.lazy(() => xref_taxon_marking_body_locationSchema.extend({
  marking: RelatedmarkingSchema.array(),
  user_xref_taxon_marking_body_location_create_userTouser: RelateduserSchema,
  user_xref_taxon_marking_body_location_update_userTouser: RelateduserSchema,
  lk_taxon: Relatedlk_taxonSchema,
}))
