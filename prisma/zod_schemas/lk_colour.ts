import * as z from "zod"
import { Completeuser, RelateduserSchema, Completemarking, RelatedmarkingSchema } from "./index"

export const lk_colourSchema = z.object({
  colour_id: z.string().uuid(),
  colour: z.string(),
  hex_code: z.string().nullish(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelk_colour extends z.infer<typeof lk_colourSchema> {
  user_lk_colour_create_userTouser: Completeuser
  user_lk_colour_update_userTouser: Completeuser
  marking_marking_primary_colour_idTolk_colour: Completemarking[]
  marking_marking_secondary_colour_idTolk_colour: Completemarking[]
  marking_marking_text_colour_idTolk_colour: Completemarking[]
}

/**
 * Relatedlk_colourSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedlk_colourSchema: z.ZodSchema<Completelk_colour> = z.lazy(() => lk_colourSchema.extend({
  user_lk_colour_create_userTouser: RelateduserSchema,
  user_lk_colour_update_userTouser: RelateduserSchema,
  marking_marking_primary_colour_idTolk_colour: RelatedmarkingSchema.array(),
  marking_marking_secondary_colour_idTolk_colour: RelatedmarkingSchema.array(),
  marking_marking_text_colour_idTolk_colour: RelatedmarkingSchema.array(),
}))
