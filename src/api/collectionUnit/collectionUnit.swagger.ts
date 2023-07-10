import { ZodOpenApiOperationObject } from 'zod-openapi';
import { CollectionUnitCreateBodySchema, CollectionUnitResponseSchema, CollectionUnitUpdateBodySchema } from './collectionUnit.utils';
import {z} from 'zod';
import { zodID } from '../../utils/zod_helpers';

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
                    schema: CollectionUnitResponseSchema
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
                    schema: CollectionUnitResponseSchema.array()
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
                    schema: CollectionUnitResponseSchema
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
                    schema: CollectionUnitResponseSchema
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
                    schema: CollectionUnitResponseSchema
                }
            }
        }
    }
}

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
