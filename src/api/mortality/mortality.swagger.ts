import { z } from "zod";
import { CommonLocationValidation } from "../location/location.utils";
import { MortalityCreateSchema, MortalityIncludeSchema } from "./mortality.utils";
import { ZodOpenApiOperationObject } from "zod-openapi";

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
});

const TAG = 'Mortalities';

const getAllMortalities: ZodOpenApiOperationObject = {
  operationId: 'getAllMortalities',
    summary: 'Get all mortalities available in the DB.',
    tags: [TAG],
    responses: {
        '200' : {
            description: 'Returned all mortalities.',
            content: {
                'application/json' : {
                    schema: SwaggerMortalityResponseValidation.array()
                }
            }
        },
    }
}

const createMortality: ZodOpenApiOperationObject = {
  operationId: 'createMortality',
    summary: 'Create a new mortality.',
    tags: [TAG],
    requestBody: {
      content: {
        'application/json' : {
          schema: MortalityCreateSchema
        }
      }
    },
    responses: {
        '201' : {
            description: 'Successfully inserted the mortality.',
            content: {
                'application/json' : {
                    schema: SwaggerMortalityResponseValidation
                }
            }
        },
    }
}