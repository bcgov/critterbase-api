import * as z from "zod"
import { Completecritter, RelatedcritterSchema, Completefamily, RelatedfamilySchema } from "./index"

export const family_parentSchema = z.object({
  family_id: z.string().uuid(),
  parent_critter_id: z.string().uuid(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completefamily_parent extends z.infer<typeof family_parentSchema> {
  critter: Completecritter
  family: Completefamily
}

/**
 * Relatedfamily_parentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedfamily_parentSchema: z.ZodSchema<Completefamily_parent> = z.lazy(() => family_parentSchema.extend({
  critter: RelatedcritterSchema,
  family: RelatedfamilySchema,
}))
