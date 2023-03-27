import * as z from "zod"
import { Completecritter, RelatedcritterSchema, Completefamily, RelatedfamilySchema } from "./index"

export const family_childSchema = z.object({
  family_id: z.string().uuid(),
  child_critter_id: z.string().uuid(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completefamily_child extends z.infer<typeof family_childSchema> {
  critter: Completecritter
  family: Completefamily
}

/**
 * Relatedfamily_childSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedfamily_childSchema: z.ZodSchema<Completefamily_child> = z.lazy(() => family_childSchema.extend({
  critter: RelatedcritterSchema,
  family: RelatedfamilySchema,
}))
