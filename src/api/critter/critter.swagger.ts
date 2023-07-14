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
import { SwagDesc, SwagErr, SwagNotFound, SwagUnauthorized } from '../../utils/swagger_helpers';

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
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
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
            description: SwagDesc.update,
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
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
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
            description: SwagDesc.delete,
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
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
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
            description: SwagDesc.create,
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
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
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
        },
        ...SwagErr,
        ...SwagUnauthorized,
    }
}

const getUniqueCritters: ZodOpenApiOperationObject = {
    operationId: 'getUniqueCritters',
    summary: `Determine whether a critter is unique or not through various identifiable features. 
    This endpoint will return an array of critters that may be partial matches to the info provided. 
    Note that providing WLH ID will override the rest of the search and filter critters by WLH ID alone.`,
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
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
    }
}

const getFilteredCritters: ZodOpenApiOperationObject = { 
    operationId: 'filterCritters',
    summary: 'Filter the entire list of critters by various features. You can also do negative filters, retrieving all critters that do not match certain features.',
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
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
    }
}

const getCrittersById: ZodOpenApiOperationObject = {
    operationId: 'crittersById',
    summary: 'Retrieve specific critters by a list of IDs',
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
            description: SwagDesc.get,
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
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound,
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
        patch: updateCritterById,
        delete: deleteCritterById
    }
}