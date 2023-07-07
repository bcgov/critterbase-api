
import {  createDocument } from 'zod-openapi';
import { stringify } from 'yaml';
import { createCollectionUnit, deleteCollectionUnit, getCollectionUnits, updateCollectionUnit } from './api/collectionUnit/collectionUnit.swagger';

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
            patch: updateCollectionUnit,
            delete: deleteCollectionUnit
        },
        '/collection-units/create' : {
            post: createCollectionUnit
        }
    }
});
console.log(stringify(document));
export const yaml = document;
