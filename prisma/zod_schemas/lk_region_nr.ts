import * as z from "zod"
import { Completecritter, RelatedcritterSchema, Completeuser, RelateduserSchema, Completelocation, RelatedlocationSchema } from "./index"

export const lk_region_nrSchema = z.object({
  region_nr_id: z.string().uuid(),
  region_nr_name: z.string(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelk_region_nr extends z.infer<typeof lk_region_nrSchema> {
  critter: Completecritter[]
  user_lk_region_nr_create_userTouser: Completeuser
  user_lk_region_nr_update_userTouser: Completeuser
  location: Completelocation[]
}

/**
 * Relatedlk_region_nrSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedlk_region_nrSchema: z.ZodSchema<Completelk_region_nr> = z.lazy(() => lk_region_nrSchema.extend({
  critter: RelatedcritterSchema.array(),
  user_lk_region_nr_create_userTouser: RelateduserSchema,
  user_lk_region_nr_update_userTouser: RelateduserSchema,
  location: RelatedlocationSchema.array(),
}))
