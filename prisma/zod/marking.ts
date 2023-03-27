import * as z from "zod"
import { frequency_unit } from "@prisma/client"
import { Completeuser, RelateduserSchema, Completecritter, RelatedcritterSchema, Completelk_marking_material, Relatedlk_marking_materialSchema, Completelk_marking_type, Relatedlk_marking_typeSchema, Completelk_colour, Relatedlk_colourSchema, Completexref_taxon_marking_body_location, Relatedxref_taxon_marking_body_locationSchema, Completecapture, RelatedcaptureSchema } from "./index"

export const markingSchema = z.object({
  marking_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  capture_id: z.string().uuid().nullish(),
  mortality_id: z.string().uuid().nullish(),
  taxon_marking_body_location_id: z.string().uuid(),
  marking_type_id: z.string().uuid().nullish(),
  marking_material_id: z.string().uuid().nullish(),
  primary_colour_id: z.string().uuid().nullish(),
  secondary_colour_id: z.string().uuid().nullish(),
  text_colour_id: z.string().uuid().nullish(),
  identifier: z.string().nullish(),
  frequency: z.number().nullish(),
  frequency_unit: z.nativeEnum(frequency_unit).nullish(),
  order: z.number().int().nullish(),
  comment: z.string().nullish(),
  attached_timestamp: z.date().nullish(),
  removed_timestamp: z.date().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completemarking extends z.infer<typeof markingSchema> {
  user_marking_create_userTouser: Completeuser
  user_marking_update_userTouser: Completeuser
  critter: Completecritter
  lk_marking_material?: Completelk_marking_material | null
  lk_marking_type?: Completelk_marking_type | null
  lk_colour_marking_primary_colour_idTolk_colour?: Completelk_colour | null
  lk_colour_marking_secondary_colour_idTolk_colour?: Completelk_colour | null
  xref_taxon_marking_body_location: Completexref_taxon_marking_body_location
  lk_colour_marking_text_colour_idTolk_colour?: Completelk_colour | null
  capture_idTocapture?: Completecapture | null
}

/**
 * RelatedmarkingSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedmarkingSchema: z.ZodSchema<Completemarking> = z.lazy(() => markingSchema.extend({
  user_marking_create_userTouser: RelateduserSchema,
  user_marking_update_userTouser: RelateduserSchema,
  critter: RelatedcritterSchema,
  lk_marking_material: Relatedlk_marking_materialSchema.nullish(),
  lk_marking_type: Relatedlk_marking_typeSchema.nullish(),
  lk_colour_marking_primary_colour_idTolk_colour: Relatedlk_colourSchema.nullish(),
  lk_colour_marking_secondary_colour_idTolk_colour: Relatedlk_colourSchema.nullish(),
  xref_taxon_marking_body_location: Relatedxref_taxon_marking_body_locationSchema,
  lk_colour_marking_text_colour_idTolk_colour: Relatedlk_colourSchema.nullish(),
  capture_idTocapture: RelatedcaptureSchema.nullish(),
}))
