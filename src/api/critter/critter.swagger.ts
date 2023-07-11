import { ZodOpenApiOperationObject } from 'zod-openapi';
import { z } from 'zod';
import { zodID } from '../../utils/zod_helpers';
import { CritterCreateSchema, CritterDefaultResponseSchema, CritterDetailedResponseSchema, CritterFilterSchema, CritterIdsRequestSchema, CritterUpdateSchema, UniqueCritterQuerySchema } from './critter.utils';
import { routes } from '../../utils/constants';

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

export const critterSchemas = {
    defaultCritterResponse: CritterDefaultResponseSchema,
    detailedCritterResponse: CritterDetailedResponseSchema,
    defaultCritterResponseArray: CritterDefaultResponseSchema.array(),
    detailedCritterResponseArray: CritterDetailedResponseSchema.array()
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
    [`${routes.critters}/:id`] : {
        get: getCritterById,
        put: updateCritterById,
        delete: deleteCritterById
    }
}