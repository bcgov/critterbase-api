import { createDocument } from "zod-openapi";
import { collectionUnitsPaths } from "./api/collectionUnit/collectionUnit.swagger";
import { critterPaths, critterSchemas } from "./api/critter/critter.swagger";
import { capturePaths } from "./api/capture/capture.swagger";
import { bulkPaths } from "./api/bulk/bulk.swagger";
import { artifactPaths } from "./api/artifact/artifact.swagger";
import { locationPaths } from "./api/location/location.swagger";
import { userPaths } from "./api/user/user.swagger";
import {
  API_KEY_HEADER,
  KEYCLOAK_UUID_HEADER,
  PORT,
  USER_ID_HEADER,
} from "./utils/constants";
import { accessPaths } from "./api/access/access.swagger";
import { enumPaths } from "./api/lookup/lookup.swagger";
import { markingPaths } from "./api/marking/marking.swagger";

const document = createDocument({
  openapi: "3.1.0",
  components: {
    schemas: {
      ...critterSchemas,
    },
    securitySchemes: {
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: API_KEY_HEADER,
        description: `A valid uuid for header: '${API_KEY_HEADER}' must be provided`,
      },
      userIdAuth: {
        type: "apiKey",
        in: "header",
        name: USER_ID_HEADER,
        description: `This header is used to identify the user. A valid uuid for header: '${USER_ID_HEADER}' must be provided`,
      },
      keycloakUuidAuth: {
        type: "apiKey",
        in: "header",
        name: KEYCLOAK_UUID_HEADER,
        description: `This header is used for user identification with Keycloak. A valid Keycloak uuid for header: '${KEYCLOAK_UUID_HEADER}' must be provided`,
      },
    },
  },
  info: {
    title: "Critterbase API",
    version: "1.0.0",
    description: "A simple demo for zod-openapi",
    license: {
      name: "MIT",
    },
  },
  paths: {
    ...critterPaths,
    ...capturePaths,
    ...collectionUnitsPaths,
    ...markingPaths,
    ...bulkPaths,
    ...artifactPaths,
    ...locationPaths,
    ...userPaths,
    ...accessPaths,
    ...enumPaths,
  },
  servers: [
    {
      url: PORT ? `http://localhost:${PORT}` : "http://localhost:3000",
      description: "local api via node",
    },
    {
      url: "https://moe-critterbase-api-dev.apps.silver.devops.gov.bc.ca",
      description: "deployed api in dev environment",
    },
    {
      url: "https://moe-critterbase-api-test.apps.silver.devops.gov.bc.ca",
      description: "deployed api in test environment",
    },
    {
      url: "https://moe-critterbase-api-prod.apps.silver.devops.gov.bc.ca",
      description: "deployed api in prod environment",
    },
  ],
  security: [
    {
      apiKeyAuth: [],
      userIdAuth: [],
      keycloakUuidAuth: [],
    },
  ],
});

//console.log(stringify(document));
export const yaml = document;
