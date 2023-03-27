import * as z from "zod"
import { sex } from "@prisma/client"
import { Completeartifact, RelatedartifactSchema, Completecapture, RelatedcaptureSchema, Completelk_region_nr, Relatedlk_region_nrSchema, Completelk_taxon, Relatedlk_taxonSchema, Completeuser, RelateduserSchema, Completecritter_collection_unit, Relatedcritter_collection_unitSchema, Completefamily_child, Relatedfamily_childSchema, Completefamily_parent, Relatedfamily_parentSchema, Completemarking, RelatedmarkingSchema, Completemeasurement_qualitative, Relatedmeasurement_qualitativeSchema, Completemeasurement_quantitative, Relatedmeasurement_quantitativeSchema, Completemortality, RelatedmortalitySchema } from "./index"

export const critterSchema = z.object({
  critter_id: z.string().uuid(),
  taxon_id: z.string().uuid(),
  wlh_id: z.string().nullish(),
  animal_id: z.string().nullish(),
  sex: z.nativeEnum(sex),
  responsible_region_nr_id: z.string().uuid().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
  critter_comment: z.string().nullish(),
})

export interface Completecritter extends z.infer<typeof critterSchema> {
  artifact: Completeartifact[]
  capture: Completecapture[]
  lk_region_nr?: Completelk_region_nr | null
  lk_taxon: Completelk_taxon
  user_critter_create_userTouser: Completeuser
  user_critter_update_userTouser: Completeuser
  critter_collection_unit: Completecritter_collection_unit[]
  family_child: Completefamily_child[]
  family_parent: Completefamily_parent[]
  marking: Completemarking[]
  measurement_qualitative: Completemeasurement_qualitative[]
  measurement_quantitative: Completemeasurement_quantitative[]
  mortality: Completemortality[]
}

/**
 * RelatedcritterSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedcritterSchema: z.ZodSchema<Completecritter> = z.lazy(() => critterSchema.extend({
  artifact: RelatedartifactSchema.array(),
  capture: RelatedcaptureSchema.array(),
  lk_region_nr: Relatedlk_region_nrSchema.nullish(),
  lk_taxon: Relatedlk_taxonSchema,
  user_critter_create_userTouser: RelateduserSchema,
  user_critter_update_userTouser: RelateduserSchema,
  critter_collection_unit: Relatedcritter_collection_unitSchema.array(),
  family_child: Relatedfamily_childSchema.array(),
  family_parent: Relatedfamily_parentSchema.array(),
  marking: RelatedmarkingSchema.array(),
  measurement_qualitative: Relatedmeasurement_qualitativeSchema.array(),
  measurement_quantitative: Relatedmeasurement_quantitativeSchema.array(),
  mortality: RelatedmortalitySchema.array(),
}))
