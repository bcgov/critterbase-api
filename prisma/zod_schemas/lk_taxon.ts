import * as z from "zod"
import { Completecritter, RelatedcritterSchema, Completeuser, RelateduserSchema, Completemortality, RelatedmortalitySchema, Completexref_taxon_collection_category, Relatedxref_taxon_collection_categorySchema, Completexref_taxon_marking_body_location, Relatedxref_taxon_marking_body_locationSchema, Completexref_taxon_measurement_qualitative, Relatedxref_taxon_measurement_qualitativeSchema, Completexref_taxon_measurement_quantitative, Relatedxref_taxon_measurement_quantitativeSchema } from "./index"

export const lk_taxonSchema = z.object({
  taxon_id: z.string().uuid(),
  kingdom_id: z.string().uuid().nullish(),
  phylum_id: z.string().uuid().nullish(),
  class_id: z.string().uuid().nullish(),
  order_id: z.string().uuid().nullish(),
  family_id: z.string().uuid().nullish(),
  genus_id: z.string().uuid().nullish(),
  species_id: z.string().uuid().nullish(),
  sub_species_id: z.string().uuid().nullish(),
  taxon_name_common: z.string().nullish(),
  taxon_name_latin: z.string(),
  spi_taxonomy_id: z.number().int(),
  taxon_description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export interface Completelk_taxon extends z.infer<typeof lk_taxonSchema> {
  critter: Completecritter[]
  user_lk_taxon_create_userTouser: Completeuser
  user_lk_taxon_update_userTouser: Completeuser
  lk_taxon_lk_taxon_class_idTolk_taxon?: Completelk_taxon | null
  other_lk_taxon_lk_taxon_class_idTolk_taxon: Completelk_taxon[]
  lk_taxon_lk_taxon_family_idTolk_taxon?: Completelk_taxon | null
  other_lk_taxon_lk_taxon_family_idTolk_taxon: Completelk_taxon[]
  lk_taxon_lk_taxon_genus_idTolk_taxon?: Completelk_taxon | null
  other_lk_taxon_lk_taxon_genus_idTolk_taxon: Completelk_taxon[]
  lk_taxon_lk_taxon_kingdom_idTolk_taxon?: Completelk_taxon | null
  other_lk_taxon_lk_taxon_kingdom_idTolk_taxon: Completelk_taxon[]
  lk_taxon_lk_taxon_order_idTolk_taxon?: Completelk_taxon | null
  other_lk_taxon_lk_taxon_order_idTolk_taxon: Completelk_taxon[]
  lk_taxon_lk_taxon_phylum_idTolk_taxon?: Completelk_taxon | null
  other_lk_taxon_lk_taxon_phylum_idTolk_taxon: Completelk_taxon[]
  lk_taxon_lk_taxon_species_idTolk_taxon?: Completelk_taxon | null
  other_lk_taxon_lk_taxon_species_idTolk_taxon: Completelk_taxon[]
  lk_taxon_lk_taxon_sub_species_idTolk_taxon?: Completelk_taxon | null
  other_lk_taxon_lk_taxon_sub_species_idTolk_taxon: Completelk_taxon[]
  mortality_mortality_proximate_predated_by_taxon_idTolk_taxon: Completemortality[]
  mortality_mortality_ultimate_predated_by_taxon_idTolk_taxon: Completemortality[]
  xref_taxon_collection_category: Completexref_taxon_collection_category[]
  xref_taxon_marking_body_location: Completexref_taxon_marking_body_location[]
  xref_taxon_measurement_qualitative: Completexref_taxon_measurement_qualitative[]
  xref_taxon_measurement_quantitative: Completexref_taxon_measurement_quantitative[]
}

/**
 * Relatedlk_taxonSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedlk_taxonSchema: z.ZodSchema<Completelk_taxon> = z.lazy(() => lk_taxonSchema.extend({
  critter: RelatedcritterSchema.array(),
  user_lk_taxon_create_userTouser: RelateduserSchema,
  user_lk_taxon_update_userTouser: RelateduserSchema,
  lk_taxon_lk_taxon_class_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
  other_lk_taxon_lk_taxon_class_idTolk_taxon: Relatedlk_taxonSchema.array(),
  lk_taxon_lk_taxon_family_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
  other_lk_taxon_lk_taxon_family_idTolk_taxon: Relatedlk_taxonSchema.array(),
  lk_taxon_lk_taxon_genus_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
  other_lk_taxon_lk_taxon_genus_idTolk_taxon: Relatedlk_taxonSchema.array(),
  lk_taxon_lk_taxon_kingdom_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
  other_lk_taxon_lk_taxon_kingdom_idTolk_taxon: Relatedlk_taxonSchema.array(),
  lk_taxon_lk_taxon_order_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
  other_lk_taxon_lk_taxon_order_idTolk_taxon: Relatedlk_taxonSchema.array(),
  lk_taxon_lk_taxon_phylum_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
  other_lk_taxon_lk_taxon_phylum_idTolk_taxon: Relatedlk_taxonSchema.array(),
  lk_taxon_lk_taxon_species_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
  other_lk_taxon_lk_taxon_species_idTolk_taxon: Relatedlk_taxonSchema.array(),
  lk_taxon_lk_taxon_sub_species_idTolk_taxon: Relatedlk_taxonSchema.nullish(),
  other_lk_taxon_lk_taxon_sub_species_idTolk_taxon: Relatedlk_taxonSchema.array(),
  mortality_mortality_proximate_predated_by_taxon_idTolk_taxon: RelatedmortalitySchema.array(),
  mortality_mortality_ultimate_predated_by_taxon_idTolk_taxon: RelatedmortalitySchema.array(),
  xref_taxon_collection_category: Relatedxref_taxon_collection_categorySchema.array(),
  xref_taxon_marking_body_location: Relatedxref_taxon_marking_body_locationSchema.array(),
  xref_taxon_measurement_qualitative: Relatedxref_taxon_measurement_qualitativeSchema.array(),
  xref_taxon_measurement_quantitative: Relatedxref_taxon_measurement_quantitativeSchema.array(),
}))
