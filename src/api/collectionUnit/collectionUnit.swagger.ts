import { ZodOpenApiOperationObject } from 'zod-openapi';
import { CollectionUnitCreateBodySchema, CollectionUnitResponseSchema, CollectionUnitUpdateBodySchema } from './collectionUnit.utils';
import {z} from 'zod';
import { zodID } from '../../utils/zod_helpers';

export const getCollectionUnits: ZodOpenApiOperationObject = {
    operationId: 'getCollectionUnit',
    summary: 'Get all collection units',
    responses: { 
        '200': {
            description: 'Successful operation',
            content: { 
                'application/json': {
                    schema: CollectionUnitResponseSchema
                }
            }
        }
    }
}

export const createCollectionUnit: ZodOpenApiOperationObject = {
    operationId: 'createCollectionUnit',
    summary: 'Create a collection unit',
    requestBody: {
        content: {
            'application/json' : {
                schema: CollectionUnitCreateBodySchema
            }
        }
    },
    responses: {
        '201' : {
            description: 'amogus',
            content: {
                'application/json' : {
                    schema: CollectionUnitResponseSchema
                }
            }
        }
    }
}

export const updateCollectionUnit: ZodOpenApiOperationObject = {
    operationId: 'updateCollectionUnit',
    summary: 'Update a collection unit',
    requestBody: {
        content: {
            'application/json' : {
                schema: CollectionUnitUpdateBodySchema
            }
        }
    },
    responses: {
        '200' : {
            description: 'amogus',
            content: {
                'application/json' : {
                    schema: CollectionUnitResponseSchema
                }
            }
        }
    }
}

export const deleteCollectionUnit: ZodOpenApiOperationObject = {
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
                    schema: CollectionUnitResponseSchema
                }
            }
        }
    }
}