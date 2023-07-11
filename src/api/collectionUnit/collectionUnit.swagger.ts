import { ZodOpenApiOperationObject } from 'zod-openapi';
import { CollectionUnitCreateBodySchema, CollectionUnitResponseSchema, CollectionUnitUpdateBodySchema, SimpleCollectionUnitIncludesSchema, critter_collection_unitIncludesSchema } from './collectionUnit.utils';
import {z} from 'zod';
import { noAudit, zodID } from '../../utils/zod_helpers';

const SwaggerCollectionResponseValidation = 
    critter_collection_unitIncludesSchema
      .omit({collection_unit_id: true, xref_collection_unit: true})
      .extend({unit_name: z.string().nullable(), unit_description: z.string().nullable()})

const getCollectionUnits: ZodOpenApiOperationObject = {
    operationId: 'getCollectionUnit',
    summary: 'Get a collection unit by id',
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



export const SwaggerSimpleCollectionResponseValidation = SimpleCollectionUnitIncludesSchema
.omit({xref_collection_unit: true, critter_id: true, ...noAudit}).extend({
  category_name: z.string(), 
  unit_name: z.string(), 
  collection_category_id: zodID
})

export const collectionUnitsPaths = {
    '/collection-units/' : {
        get: getAllCollectionUnits
    },
    '/collection-units/:id' : {
        get: getCollectionUnits,
        patch: updateCollectionUnit,
        delete: deleteCollectionUnit
    },
    '/collection-units/create' : {
        post: createCollectionUnit
    },
}
