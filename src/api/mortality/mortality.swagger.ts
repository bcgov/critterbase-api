import { z } from "zod";
import { CommonLocationValidation } from "../location/location.utils";
import { MortalityIncludeSchema } from "./mortality.utils";

export const SwaggerMortalityResponseValidation = MortalityIncludeSchema.omit({
    lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: true, 
    lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: true,
    lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: true,
    lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: true})
    .extend({
      location: CommonLocationValidation.nullable(),
      proximate_cause_of_death: z.object({cod_category: z.string(), cod_reason: z.string().nullable()}),
      ultimate_cause_of_death: z.object({cod_category: z.string(), cod_reason: z.string().nullable()}).nullable(),
      proximate_cause_of_death_taxon: z.object({taxon_id: z.string(), taxon_name_latin: z.string()}).nullable(),
      ultimate_cause_of_death_taxon: z.object({taxon_id: z.string(), taxon_name_latin: z.string()}).nullable()
  })