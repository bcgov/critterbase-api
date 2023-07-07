import fs from 'fs';
import path from 'path';
import { ZodOpenApiOperationObject, createDocument } from 'zod-openapi';
import { CollectionUnitCreateBodySchema, CollectionUnitResponseSchema } from './api/collectionUnit/collectionUnit.utils';
import { stringify } from 'yaml';

const getCollectionUnits: ZodOpenApiOperationObject = {
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

const createCollectionUnit: ZodOpenApiOperationObject = {
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
            description: 'amogus'
        }
    }
}

const document = createDocument({
    openapi: '3.1.0',
    info: {
        title: 'Critterbase API',
        version: '1.0.0',
        description: 'A simple demo for zod-openapi',
        license: {
            name: 'MIT'
        },
    },
    paths: {
        '/collection-units' : {
            get: getCollectionUnits,
            post: createCollectionUnit
        }
    }
});
console.log(stringify(document));
export const yaml = document;
