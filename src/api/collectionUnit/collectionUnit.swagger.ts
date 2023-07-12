import { ZodOpenApiOperationObject } from 'zod-openapi';
import { CollectionUnitCreateBodySchema, CollectionUnitUpdateBodySchema, SimpleCollectionUnitIncludesSchema, critter_collection_unitIncludesSchema } from './collectionUnit.utils';
import {z} from 'zod';
import { noAudit, zodID } from '../../utils/zod_helpers';
import { routes } from '../../utils/constants';

const SwaggerCollectionResponseValidation = 
    critter_collection_unitIncludesSchema
      .omit({collection_unit_id: true, xref_collection_unit: true})
      .extend({unit_name: z.string().nullable(), unit_description: z.string().nullable()})

const TAG = 'Collection units';

const getCollectionUnits: ZodOpenApiOperationObject = {
    operationId: 'getCollectionUnit',
    summary: 'Get a collection unit by id',
    tags: [TAG],
    requestParams: {
        path: z.object( {id: zodID} )
    },
    responses: {
        '200': {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: SwaggerCollectionResponseValidation
                }
            }
        }
    }
}

const getAllCollectionUnits: ZodOpenApiOperationObject = {
    operationId: 'getCollectionUnits',
    summary: 'Get every critter collection unit entry.',
    tags: [TAG],
    responses: {
        '200': {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: SwaggerCollectionResponseValidation.array()
                }
            }
        }
    }
}

const createCollectionUnit: ZodOpenApiOperationObject = {
    operationId: 'createCollectionUnit',
    summary: 'Create a critter collection unit assignment',
    tags: [TAG],
    requestBody: {
        content: {
            'application/json' : {
                schema: CollectionUnitCreateBodySchema
            }
        }
    },
    responses: {
        '201' : {
            description: 'Created successfully.',
            content: {
                'application/json' : {
                    schema: SwaggerCollectionResponseValidation
                }
            }
        }
    }
}

const updateCollectionUnit: ZodOpenApiOperationObject = {
    operationId: 'updateCollectionUnit',
    summary: 'Update a collection unit',
    tags: [TAG],
    requestParams: {
        path: z.object( {id: zodID} )
    },
    requestBody: {
        content: {
            'application/json' : {
                schema: CollectionUnitUpdateBodySchema
            }
        }
    },
    responses: {
        '200' : {
            description: 'Updated successfully.',
            content: {
                'application/json' : {
                    schema: SwaggerCollectionResponseValidation
                }
            }
        }
    }
}

const deleteCollectionUnit: ZodOpenApiOperationObject = {
    operationId: 'deleteCollectionUnit',
    summary: 'Deletes a collection unit',
    tags: [TAG],
    requestParams: {
        path: z.object( {id: zodID} )
    },
    responses: {
        '200' : {
            description: 'Item successfully deleted.',
            content: {
                'application/json' : {
                    schema: SwaggerCollectionResponseValidation
                }
            }
        }
    }
}

const getCollectionUnitsByCritterId: ZodOpenApiOperationObject = {
    operationId: 'getCollectionUnitsByCritterId',
    summary: 'Get all critter collection units associated with the provided critter id.',
    tags: [TAG],
    requestParams: {
        path: z.object( {id: zodID} )
    },
    responses: {
        '200' : {
            description: 'Item successfully deleted.',
            content: {
                'application/json' : {
                    schema: SwaggerCollectionResponseValidation.array()
                }
            }
        }
    }
}


export const SwaggerSimpleCollectionResponseValidation = SimpleCollectionUnitIncludesSchema
.omit({xref_collection_unit: true, critter_id: true, ...noAudit}).extend({
  category_name: z.string(), 
  unit_name: z.string(), 
  collection_category_id: zodID
})

export const collectionUnitsPaths = {
    [`${routes.collection_units}`] : {
        get: getAllCollectionUnits
    },
    [`${routes.collection_units}/create`] : {
        post: createCollectionUnit
    },
    [`${routes.collection_units}/critter/:id`] : {
        get: getCollectionUnitsByCritterId
    },
    [`${routes.collection_units}/:id`] : {
        get: getCollectionUnits,
        patch: updateCollectionUnit,
        delete: deleteCollectionUnit
    }
}
