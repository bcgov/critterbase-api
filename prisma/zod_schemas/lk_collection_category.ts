import * as z from "zod"
import { Completeuser, RelateduserSchema, Completexref_collection_unit, Relatedxref_collection_unitSchema, Completexref_taxon_collection_category, Relatedxref_taxon_collection_categorySchema } from "./index"

export const lk_collection_categorySchema = z.object({
  collection_category_id: z.string().uuid(),
  category_name: z.string(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelk_collection_category extends z.infer<typeof lk_collection_categorySchema> {
  user_lk_collection_category_create_userTouser: Completeuser
  user_lk_collection_category_update_userTouser: Completeuser
  xref_collection_unit: Completexref_collection_unit[]
  xref_taxon_collection_category: Completexref_taxon_collection_category[]
}

/**
 * Relatedlk_collection_categorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedlk_collection_categorySchema: z.ZodSchema<Completelk_collection_category> = z.lazy(() => lk_collection_categorySchema.extend({
  user_lk_collection_category_create_userTouser: RelateduserSchema,
  user_lk_collection_category_update_userTouser: RelateduserSchema,
  xref_collection_unit: Relatedxref_collection_unitSchema.array(),
  xref_taxon_collection_category: Relatedxref_taxon_collection_categorySchema.array(),
}))
