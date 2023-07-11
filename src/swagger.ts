
import {  createDocument } from 'zod-openapi';
import { stringify } from 'yaml';
import { collectionUnitsPaths } from './api/collectionUnit/collectionUnit.swagger';
import { critterPaths, critterSchemas } from './api/critter/critter.swagger';
import { CritterDefaultResponseSchema, CritterDetailedResponseSchema } from './api/critter/critter.utils';
import  {z}from 'zod'
import { capturePaths } from './api/capture/capture.swagger';
import { artifactPaths } from './api/artifact/artifact.swagger';

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
        ...artifactPaths
    }
});
//console.log(stringify(document));
export const yaml = document;
