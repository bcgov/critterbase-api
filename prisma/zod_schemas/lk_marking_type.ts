import * as z from "zod"
import { Completeuser, RelateduserSchema, Completemarking, RelatedmarkingSchema } from "./index"

export const lk_marking_typeSchema = z.object({
  marking_type_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelk_marking_type extends z.infer<typeof lk_marking_typeSchema> {
  user_lk_marking_type_create_userTouser: Completeuser
  user_lk_marking_type_update_userTouser: Completeuser
  marking: Completemarking[]
}

/**
 * Relatedlk_marking_typeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedlk_marking_typeSchema: z.ZodSchema<Completelk_marking_type> = z.lazy(() => lk_marking_typeSchema.extend({
  user_lk_marking_type_create_userTouser: RelateduserSchema,
  user_lk_marking_type_update_userTouser: RelateduserSchema,
  marking: RelatedmarkingSchema.array(),
}))
