
import {  createDocument } from 'zod-openapi';
import { stringify } from 'yaml';
import { createCollectionUnit, deleteCollectionUnit, getAllCollectionUnits, getCollectionUnits, updateCollectionUnit } from './api/collectionUnit/collectionUnit.swagger';
import { getCritterById } from './api/critter/critter.swagger';
import { CritterDefaultResponseSchema, CritterDetailedResponseSchema } from './api/critter/critter.utils';
import  {z}from 'zod'
import { capturePaths } from './api/capture/capture.swagger';

const document = createDocument({
    openapi: '3.1.0',
    components: {
        schemas: {
            defaultCritterResponse: CritterDefaultResponseSchema,
            detailedCritterResponse: CritterDetailedResponseSchema
        }
    },
    info: {
        title: 'Critterbase API',
        version: '1.0.0',
        description: 'A simple demo for zod-openapi',
        license: {
            name: 'MIT'
        },
    },
    paths: {
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
        '/critter/:id' : {
            get: getCritterById
        },
        ...capturePaths,
    }
});
console.log(stringify(document));
export const yaml = document;
