import * as z from "zod"
import { Completeuser, RelateduserSchema, Completemarking, RelatedmarkingSchema } from "./index"

export const lk_marking_materialSchema = z.object({
  marking_material_id: z.string().uuid(),
  material: z.string().nullish(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelk_marking_material extends z.infer<typeof lk_marking_materialSchema> {
  user_lk_marking_material_create_userTouser: Completeuser
  user_lk_marking_material_update_userTouser: Completeuser
  marking: Completemarking[]
}

/**
 * Relatedlk_marking_materialSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedlk_marking_materialSchema: z.ZodSchema<Completelk_marking_material> = z.lazy(() => lk_marking_materialSchema.extend({
  user_lk_marking_material_create_userTouser: RelateduserSchema,
  user_lk_marking_material_update_userTouser: RelateduserSchema,
  marking: RelatedmarkingSchema.array(),
}))
