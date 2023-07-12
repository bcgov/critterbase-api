import { ZodOpenApiOperationObject } from 'zod-openapi';
import { z } from 'zod';
import { noAudit, zodID } from '../../utils/zod_helpers';
import { CritterCreateSchema, DefaultCritterIncludeSchema, DetailedCritterIncludeSchema, CritterFilterSchema, CritterIdsRequestSchema, CritterUpdateSchema, UniqueCritterQuerySchema } from './critter.utils';
import { routes } from '../../utils/constants';
import { system } from '@prisma/client';
import { SwaggerSimpleCollectionResponseValidation } from '../collectionUnit/collectionUnit.swagger';
import { SwaggerMortalityResponseValidation } from '../mortality/mortality.swagger';
import { SwaggerCaptureResponseValidation } from '../capture/capture.swagger';
import { SwaggerMarkingResponseValidation } from '../marking/marking.swagger';
import { SwaggerQualitativeResponseValidationSchema, SwaggerQuantitativeResponseValidationSchema } from '../measurement/measurement.swagger'

const TAG = 'Critter';

const getCritterById: ZodOpenApiOperationObject = {
    operationId: 'getCritterById',
    summary: 'Get a critter by id',
    tags: [TAG],
    requestParams: {
        path: z.object( { id: zodID }),
        query: z.object( {format: z.enum(['default', 'detailed'])})
    },
    responses: { 
        '200': {
            description: 'Successfully returned critter',
            content: { 
                'application/json': {
                    schema: {
                        oneOf: [
                            { "$ref": "#/components/schemas/defaultCritterResponse" },
                            { "$ref": "#/components/schemas/detailedCritterResponse"}
                        ]
                    }
                }
            }
        }
    }
}

const updateCritterById: ZodOpenApiOperationObject = {
    operationId: 'updateCritterById',
    summary: 'Update a critter by id',
    tags: [TAG],
    requestParams: {
        path: z.object( { id: zodID } ),
        query: z.object( {format: z.enum(['default', 'detailed'])})
    },
    requestBody: {
        content: {
            'application/json' : {
                schema: CritterUpdateSchema
            }
        }
    },
    responses: { 
        '200': {
            description: 'Successfully updated critter',
            content: { 
                'application/json': {
                    schema: {
                        oneOf: [
                            { "$ref": "#/components/schemas/defaultCritterResponse" },
                            { "$ref": "#/components/schemas/detailedCritterResponse"}
                        ]
                    }
                }
            }
        }
    }
}

const deleteCritterById: ZodOpenApiOperationObject = {
    operationId: 'deleteCritterById',
    summary: 'Delete a critter by id',
    tags: [TAG],
    requestParams: {
        path: z.object( { id: zodID } ),
        query: z.object( {format: z.enum(['default', 'detailed'])})
    },
    responses: { 
        '200': {
            description: 'Successfully deleted critter',
            content: { 
                'application/json': {
                    schema: {
                        oneOf: [
                            { "$ref": "#/components/schemas/defaultCritterResponse" },
                            { "$ref": "#/components/schemas/detailedCritterResponse"}
                        ]
                    }
                }
            }
        }
    }
}

const createCritter: ZodOpenApiOperationObject = {
    operationId: 'createCritter',
    summary: 'Create a new critter',
    tags: [TAG],
    requestParams: {
        path: z.object( { id: zodID } ),
        query: z.object( {format: z.enum(['default', 'detailed'])})
    },
    requestBody: {
        content: {
            'application/json' : {
                schema: CritterCreateSchema
            }
        }
    },
    responses: {
        '201' : {
            description: 'Successfully created a new critter',
            content: {
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref": "#/components/schemas/defaultCritterResponse" },
                            { "$ref": "#/components/schemas/detailedCritterResponse"}
                        ]
                    }
                }
            }
        }
    }
}

const getAllCritters: ZodOpenApiOperationObject = {
    operationId: 'getAllCritters',
    summary: 'Fetch all critters available in critterbase',
    tags: [TAG],
    requestParams: {
        query: z.object( {format: z.enum(['default', 'detailed']), wlh_id: z.string().optional() })
    },
    responses: {
        '200' : {
            description: 'Returned all critters successfully, or all critters matching WLH ID if provided.',
            content: {
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref": "#/components/schemas/defaultCritterResponseArray" },
                            { "$ref": "#/components/schemas/detailedCritterResponseArray"}
                        ]
                    }
                }
            }
        },
        '404' : {
            description: 'Will return 404 if there were no critters matching a provided WLH ID'
        }
    }
}

const getUniqueCritters: ZodOpenApiOperationObject = {
    operationId: 'getUniqueCritters',
    summary: 'Determine whether a critter is unique or not through various identifiable features.',
    tags: [TAG],
    requestParams: {
        query: z.object( {format: z.enum(['default', 'detailed']) })
    },
    requestBody: {
        content: {
            'application/json' : {
                schema: UniqueCritterQuerySchema
            }
        }
    },
    responses: {
        '200' : {
            description: 'Returned all critters successfully, or all critters matching WLH ID if provided.',
            content: {
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref": "#/components/schemas/defaultCritterResponseArray" },
                            { "$ref": "#/components/schemas/detailedCritterResponseArray"}
                        ]
                    }
                }
            }
        },
    }
}

const getFilteredCritters: ZodOpenApiOperationObject = { 
    operationId: 'filterCritters',
    summary: 'Filter the entire list of critters by various features',
    tags: [TAG],
    requestParams: {
        query: z.object( {format: z.enum(['default', 'detailed']) })
    },
    requestBody: {
        content: {
            'application/json' : {
                schema: CritterFilterSchema
            }
        }
    },
    responses: {
        '200' : {
            description: 'Returned all critters that matched the provided request body criteria.',
            content: {
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref": "#/components/schemas/defaultCritterResponseArray" },
                            { "$ref": "#/components/schemas/detailedCritterResponseArray"}
                        ]
                    }
                }
            }
        },
    }
}

const getCrittersById: ZodOpenApiOperationObject = {
    operationId: 'crittersById',
    summary: 'Retrieved specific critters by a list of IDs',
    tags: [TAG],
    requestParams: {
        query: z.object( {format: z.enum(['default', 'detailed']) })
    },
    requestBody: {
        content: {
            'application/json' : {
                schema: CritterIdsRequestSchema
            }
        }
    },
    responses: {
        '200' : {
            description: 'Returned all critters in the list.',
            content: {
                'application/json' : {
                    schema: {
                        oneOf: [
                            { "$ref": "#/components/schemas/defaultCritterResponseArray" },
                            { "$ref": "#/components/schemas/detailedCritterResponseArray"}
                        ]
                    }
                }
            }
        },
    }
}

   const SwaggerDefaultCritterResponseSchema =  DefaultCritterIncludeSchema
    .omit({critter_collection_unit: true, lk_taxon: true, mortality: true})
    .extend({taxon: z.string(), collection_units: SwaggerSimpleCollectionResponseValidation.array(), mortality_timestamp: z.string().nullable()})
  .openapi({
    example: {
      "critter_id": "43201d4d-f16f-4f8e-8413-dde5d4a195e6",
      "wlh_id": "17-1053322",
      "animal_id": "94",
      "sex": "Female",
      "taxon": "Caribou",
      "collection_units": [
          {
              "critter_collection_unit_id": "c971d7c8-5ddf-44ac-a206-70e3f83d9ce1",
              "collection_unit_id": "a3218908-8b78-4f76-94dd-ba74273b8c93",
              "category_name": "Population Unit",
              "unit_name": "Columbia North",
              "collection_category_id": "c8e23255-7ed2-4551-b0a4-0d980dba1298"
          }
      ],
      "mortality_timestamp": "2021-12-09T10:00:00.000Z"
    }
  });

    const SwaggerDetailedCritterResponseSchema = DetailedCritterIncludeSchema
    .omit({measurement_qualitative: true, measurement_quantitative: true, lk_taxon: true, lk_region_nr: true, user_critter_create_userTouser: true, critter_collection_unit: true})
    .extend({
      taxon: z.string(),
      responsible_region: z.string().optional(),
      mortality_timestamp: z.date().nullable(),
      system_origin: z.nativeEnum(system),
      collection_units: SwaggerSimpleCollectionResponseValidation.array(),
      mortality: SwaggerMortalityResponseValidation.omit({critter_id: true, ...noAudit}).array(),
      capture: SwaggerCaptureResponseValidation.omit({critter_id: true, ...noAudit}).array(),
      marking: SwaggerMarkingResponseValidation.omit({critter_id: true, ...noAudit}).array(),
      measurement: z.object({
        qualitative: SwaggerQualitativeResponseValidationSchema.omit({critter_id: true, ...noAudit}).array(),
        quantitative: SwaggerQuantitativeResponseValidationSchema.omit({critter_id: true, ...noAudit}).array()
      })
    }
  )

export const critterSchemas = {
    defaultCritterResponse: SwaggerDefaultCritterResponseSchema,
    detailedCritterResponse: SwaggerDetailedCritterResponseSchema,
    defaultCritterResponseArray: SwaggerDefaultCritterResponseSchema.array(),
    detailedCritterResponseArray: SwaggerDetailedCritterResponseSchema.array()
}

export const critterPaths = {
    [`${routes.critters}`] : {
        get: getAllCritters,
        post: getCrittersById
    },
    [`${routes.critters}/filter`] : {
        post: getFilteredCritters
    },
    [`${routes.critters}/unique`] : {
        post: getUniqueCritters
    },
    [`${routes.critters}/create`] : {
        post: createCritter
    },
    [`${routes.critters}/{id}`] : {
        get: getCritterById,
        put: updateCritterById,
        delete: deleteCritterById
    }
}