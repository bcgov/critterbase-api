
import {  createDocument } from 'zod-openapi';
import { collectionUnitsPaths } from './api/collectionUnit/collectionUnit.swagger';
import { critterPaths, critterSchemas } from './api/critter/critter.swagger';
import { capturePaths } from './api/capture/capture.swagger';
import { bulkPaths } from './api/bulk/bulk.swagger';
import { artifactPaths } from './api/artifact/artifact.swagger';
import { locationPaths } from './api/location/location.swagger';

const document = createDocument({
    openapi: '3.1.0',
    components: {
        schemas: {
            ...critterSchemas
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
        ...collectionUnitsPaths,
        ...critterPaths,
        ...capturePaths,
        ...bulkPaths,
        ...artifactPaths,
        ...locationPaths,
    }
});
//console.log(stringify(document));
export const yaml = document;
