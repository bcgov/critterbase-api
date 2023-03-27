import * as z from "zod"
import { Completecritter_collection_unit, Relatedcritter_collection_unitSchema, Completelk_collection_category, Relatedlk_collection_categorySchema, Completeuser, RelateduserSchema } from "./index"

export const xref_collection_unitSchema = z.object({
  collection_unit_id: z.string().uuid(),
  collection_category_id: z.string().uuid(),
  unit_name: z.string(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completexref_collection_unit extends z.infer<typeof xref_collection_unitSchema> {
  critter_collection_unit: Completecritter_collection_unit[]
  lk_collection_category: Completelk_collection_category
  user_xref_collection_unit_create_userTouser: Completeuser
  user_xref_collection_unit_update_userTouser: Completeuser
}

/**
 * Relatedxref_collection_unitSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedxref_collection_unitSchema: z.ZodSchema<Completexref_collection_unit> = z.lazy(() => xref_collection_unitSchema.extend({
  critter_collection_unit: Relatedcritter_collection_unitSchema.array(),
  lk_collection_category: Relatedlk_collection_categorySchema,
  user_xref_collection_unit_create_userTouser: RelateduserSchema,
  user_xref_collection_unit_update_userTouser: RelateduserSchema,
}))
