import { z } from "zod";
import { CommonLocationValidation } from "../location/location.utils";
import { MortalityCreateSchema, MortalityIncludeSchema, MortalityUpdateSchema } from "./mortality.utils";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { zodID } from "../../utils/zod_helpers";
import { routes } from "../../utils/constants";

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

const getMortalityByCritter: ZodOpenApiOperationObject = {
    operationId: 'getMortalityByCritter',
    summary: 'Get all mortalities associated with the provided critter id.',
    tags: [TAG],
    requestParams : {
      path: z.object( { id: zodID } )
    },
    responses: {
        '200' : {
            description: 'Retrieved all mortalities for this critter. Should only be one in most cases.',
            content: {
                'application/json' : {
                    schema: SwaggerMortalityResponseValidation.array()
                }
            }
        },
    }
}

const getMortalityById: ZodOpenApiOperationObject = {
  operationId: 'getMortalityById',
  summary: 'Get a mortality by ID.',
  tags: [TAG],
  requestParams : {
    path: z.object( { id: zodID } )
  },
  responses: {
      '200' : {
          description: 'Retrieved the mortality.',
          content: {
              'application/json' : {
                  schema: SwaggerMortalityResponseValidation
              }
          }
      },
  }
}

const updateMortality: ZodOpenApiOperationObject = {
  operationId: 'updateMortality',
  summary: 'Update a mortality by ID.',
  tags: [TAG],
  requestParams : {
    path: z.object( { id: zodID } )
  },
  requestBody: {
    content: {
      'application/json' : {
        schema: MortalityUpdateSchema
      }
    }
  },
  responses: {
      '200' : {
          description: 'Updated the mortality.',
          content: {
              'application/json' : {
                  schema: SwaggerMortalityResponseValidation
              }
          }
      },
  }
}

const deleteMortality: ZodOpenApiOperationObject = {
  operationId: 'deleteMortality',
  summary: 'Delete a mortality by ID.',
  tags: [TAG],
  requestParams : {
    path: z.object( { id: zodID } )
  },
  responses: {
      '200' : {
          description: 'Deleted the mortality.',
          content: {
              'application/json' : {
                  schema: SwaggerMortalityResponseValidation
              }
          }
      },
  }
}

export const mortalityPaths = {
  [`${routes.mortality}`] : {
    get: getAllMortalities
  },
  [`${routes.mortality}/create`] : {
    post: createMortality
  },
  [`${routes.mortality}/critter/{id}`] : {
    get: getMortalityByCritter
  },
  [`${routes.mortality}/{id}`] : {
    get: getMortalityById,
    put: updateMortality,
    delete: deleteMortality
  },
}