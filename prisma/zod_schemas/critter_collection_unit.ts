import * as z from "zod"
import { Completecritter, RelatedcritterSchema, Completexref_collection_unit, Relatedxref_collection_unitSchema, Completeuser, RelateduserSchema } from "./index"

export const critter_collection_unitSchema = z.object({
  critter_collection_unit_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  collection_unit_id: z.string().uuid(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completecritter_collection_unit extends z.infer<typeof critter_collection_unitSchema> {
  critter: Completecritter
  xref_collection_unit: Completexref_collection_unit
  user_critter_collection_unit_create_userTouser: Completeuser
  user_critter_collection_unit_update_userTouser: Completeuser
}

/**
 * Relatedcritter_collection_unitSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedcritter_collection_unitSchema: z.ZodSchema<Completecritter_collection_unit> = z.lazy(() => critter_collection_unitSchema.extend({
  critter: RelatedcritterSchema,
  xref_collection_unit: Relatedxref_collection_unitSchema,
  user_critter_collection_unit_create_userTouser: RelateduserSchema,
  user_critter_collection_unit_update_userTouser: RelateduserSchema,
}))
