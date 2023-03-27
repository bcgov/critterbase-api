import * as z from "zod"
import { Completeuser, RelateduserSchema, Completelocation, RelatedlocationSchema } from "./index"

export const lk_region_envSchema = z.object({
  region_env_id: z.string().uuid(),
  region_env_name: z.string(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelk_region_env extends z.infer<typeof lk_region_envSchema> {
  user_lk_region_env_create_userTouser: Completeuser
  user_lk_region_env_update_userTouser: Completeuser
  location: Completelocation[]
}

/**
 * Relatedlk_region_envSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedlk_region_envSchema: z.ZodSchema<Completelk_region_env> = z.lazy(() => lk_region_envSchema.extend({
  user_lk_region_env_create_userTouser: RelateduserSchema,
  user_lk_region_env_update_userTouser: RelateduserSchema,
  location: RelatedlocationSchema.array(),
}))
