import { createDocument } from 'zod-openapi';
import { collectionUnitsPaths } from './api/collectionUnit/collectionUnit.swagger';
import { critterPaths, critterSchemas } from './api/critter/critter.swagger';
import { capturePaths } from './api/capture/capture.swagger';
import { bulkPaths } from './api/bulk/bulk.swagger';
import { artifactPaths } from './api/artifact/artifact.swagger';
import { locationPaths } from './api/location/location.swagger';
import { userPaths } from './api/user/user.swagger';
import { PORT } from './utils/constants';
import { accessPaths } from './api/access/access.swagger';
import { enumPaths, lookupSchemas } from './api/lookup/lookup.swagger';
import { markingPaths } from './api/marking/marking.swagger';
import { familyPaths } from './api/family/family.swagger';
import { mortalityPaths } from './api/mortality/mortality.swagger';
import { xrefPaths, xrefSchemas } from './api/xref/xref.swagger';
import { measurementPaths } from './api/measurement/measurement.swagger';

const document = createDocument({
  openapi: '3.1.0',
  info: {
    title: 'Critterbase API',
    version: '1.0.0',
    description: 'BCGov Critterbase API',
    license: {
      name: 'MIT'
    }
  },
  components: {
    schemas: {
      ...critterSchemas,
      ...lookupSchemas,
      ...xrefSchemas
    },
    securitySchemes: {
      bearerAuth: {
        description: 'Keycloak token from `allowed` service account. (SIMS / BCTW)',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    headers: {
      user: {
        description: 'User credentials for critterbase auditing.',
        required: true,
        schema: {
          type: 'object',
          properties: {
            keycloak_guid: {
              description: `User's assigned keycloak identifier.`,
              type: 'string',
              format: 'uuid'
            },
            username: {
              description: `User's external system username or identifier.`,
              type: 'string'
            }
          },
          example: { keycloak_guid: '0000ABC0000CBD0000EFG', username: 'Steve Brule' }
        }
      }
    }
  },
  security: [
    {
      beaerAuth: []
    }
  ],
  paths: {
    ...critterPaths,
    ...capturePaths,
    ...mortalityPaths,
    ...collectionUnitsPaths,
    ...markingPaths,
    ...bulkPaths,
    ...artifactPaths,
    ...locationPaths,
    ...userPaths,
    ...accessPaths,
    ...enumPaths,
    ...xrefPaths,
    ...familyPaths,
    ...measurementPaths
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local development API.'
    },
    {
      url: 'https://moe-critterbase-api-dev.apps.silver.devops.gov.bc.ca',
      description: 'Deployed API in Openshift DEV environment.'
    },
    {
      url: 'https://moe-critterbase-api-test.apps.silver.devops.gov.bc.ca',
      description: 'Deployed API in Openshift TEST environment.'
    },
    {
      url: 'https://moe-critterbase-api-prod.apps.silver.devops.gov.bc.ca',
      description: 'Deployed API in PROD environment.'
    }
  ]
});

export const yaml = document;
