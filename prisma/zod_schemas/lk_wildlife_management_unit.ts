import * as z from "zod"
import { Completeuser, RelateduserSchema, Completelocation, RelatedlocationSchema } from "./index"

export const lk_wildlife_management_unitSchema = z.object({
  wmu_id: z.string().uuid(),
  wmu_name: z.string(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelk_wildlife_management_unit extends z.infer<typeof lk_wildlife_management_unitSchema> {
  user_lk_wildlife_management_unit_create_userTouser: Completeuser
  user_lk_wildlife_management_unit_update_userTouser: Completeuser
  location: Completelocation[]
}

/**
 * Relatedlk_wildlife_management_unitSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedlk_wildlife_management_unitSchema: z.ZodSchema<Completelk_wildlife_management_unit> = z.lazy(() => lk_wildlife_management_unitSchema.extend({
  user_lk_wildlife_management_unit_create_userTouser: RelateduserSchema,
  user_lk_wildlife_management_unit_update_userTouser: RelateduserSchema,
  location: RelatedlocationSchema.array(),
}))
