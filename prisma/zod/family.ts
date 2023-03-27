import * as z from "zod"
import { Completefamily_child, Relatedfamily_childSchema, Completefamily_parent, Relatedfamily_parentSchema } from "./index"

export const familySchema = z.object({
  family_id: z.string().uuid(),
  family_label: z.string(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completefamily extends z.infer<typeof familySchema> {
  family_child: Completefamily_child[]
  family_parent: Completefamily_parent[]
}

/**
 * RelatedfamilySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedfamilySchema: z.ZodSchema<Completefamily> = z.lazy(() => familySchema.extend({
  family_child: Relatedfamily_childSchema.array(),
  family_parent: Relatedfamily_parentSchema.array(),
}))
