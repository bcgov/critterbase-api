import * as z from "zod"
import { Completeuser, RelateduserSchema, Completemortality, RelatedmortalitySchema } from "./index"

export const lk_cause_of_deathSchema = z.object({
  cod_id: z.string().uuid(),
  cod_category: z.string(),
  cod_reason: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelk_cause_of_death extends z.infer<typeof lk_cause_of_deathSchema> {
  user_lk_cause_of_death_create_userTouser: Completeuser
  user_lk_cause_of_death_update_userTouser: Completeuser
  mortality_mortality_proximate_cause_of_death_idTolk_cause_of_death: Completemortality[]
  mortality_mortality_ultimate_cause_of_death_idTolk_cause_of_death: Completemortality[]
}

/**
 * Relatedlk_cause_of_deathSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedlk_cause_of_deathSchema: z.ZodSchema<Completelk_cause_of_death> = z.lazy(() => lk_cause_of_deathSchema.extend({
  user_lk_cause_of_death_create_userTouser: RelateduserSchema,
  user_lk_cause_of_death_update_userTouser: RelateduserSchema,
  mortality_mortality_proximate_cause_of_death_idTolk_cause_of_death: RelatedmortalitySchema.array(),
  mortality_mortality_ultimate_cause_of_death_idTolk_cause_of_death: RelatedmortalitySchema.array(),
}))
