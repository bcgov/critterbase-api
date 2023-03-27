import * as z from "zod"
import { cod_confidence, cod_confidence } from "@prisma/client"
import { Completeuser, RelateduserSchema, Completecritter, RelatedcritterSchema, Completelocation, RelatedlocationSchema, Completelk_cause_of_death, Relatedlk_cause_of_deathSchema, Completelk_taxon, Relatedlk_taxonSchema } from "./index"

export const mortalitySchema = z.object({
  mortality_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  location_id: z.string().uuid().nullish(),
  mortality_timestamp: z.date(),
  proximate_cause_of_death_id: z.string().uuid(),
  proximate_cause_of_death_confidence: z.nativeEnum(cod_confidence).nullish(),
  proximate_predated_by_taxon_id: z.string().uuid().nullish(),
  ultimate_cause_of_death_id: z.string().uuid().nullish(),
  ultimate_cause_of_death_confidence: z.nativeEnum(cod_confidence).nullish(),
  ultimate_predated_by_taxon_id: z.string().uuid().nullish(),
  mortality_comment: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completemortality extends z.infer<typeof mortalitySchema> {
  user_mortality_create_userTouser: Completeuser
  user_mortality_update_userTouser: Completeuser
  critter: Completecritter
  location?: Completelocation | null
  lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: Completelk_cause_of_death
  lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon?: Completelk_taxon | null
  lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death?: Completelk_cause_of_death | null
  lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon?: Completelk_taxon | null
}

/**
 * RelatedmortalitySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedmortalitySchema: z.ZodSchema<Completemortality> = z.lazy(() => mortalitySchema.extend({
  user_mortality_create_userTouser: RelateduserSchema,
  user_mortality_update_userTouser: RelateduserSchema,
  critter: RelatedcritterSchema,
  location: RelatedlocationSchema.nullish(),
  lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: Relatedlk_cause_of_deathSchema,
  lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
  lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: Relatedlk_cause_of_deathSchema.nullish(),
  lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
}))
