import { createDocument } from "zod-openapi";
import { collectionUnitsPaths } from "./api/collectionUnit/collectionUnit.swagger";
import { critterPaths, critterSchemas } from "./api/critter/critter.swagger";
import { capturePaths } from "./api/capture/capture.swagger";
import { bulkPaths } from "./api/bulk/bulk.swagger";
import { artifactPaths } from "./api/artifact/artifact.swagger";
import { locationPaths } from "./api/location/location.swagger";
import { userPaths } from "./api/user/user.swagger";
import { PORT } from "./utils/constants";
import { accessPaths } from "./api/access/access.swagger";
import { enumPaths, lookupSchemas } from "./api/lookup/lookup.swagger";
import { markingPaths } from "./api/marking/marking.swagger";
import { familyPaths } from "./api/family/family.swagger";
import { mortalityPaths } from "./api/mortality/mortality.swagger";
import { xrefPaths, xrefSchemas } from "./api/xref/xref.swagger";
import { measurementPaths } from "./api/measurement/measurement.swagger";

const document = createDocument({
  openapi: "3.1.0",
  components: {
    schemas: {
      ...critterSchemas,
      ...lookupSchemas,
      ...xrefSchemas,
    },
    //TODO: add keycloak authentication into securitySchemes for service accounts.
    securitySchemes: {
      userAuth: {
        type: "apiKey",
        in: "header",
        name: "user",
        description: `
          Key value pair for keycloak_guid and username.This header is used to identify specific users from external systems that authenticate with keycloak service account.
          example: {"keycloak_guid":"0000ABC0000CBD0000EFG","username":"John Smith"}`,
      },
    },
  },
  info: {
    title: "Critterbase API",
    version: "1.0.0",
    description: "BCGov Critterbase API",
    license: {
      name: "MIT",
    },
  },
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
    ...measurementPaths,
  },
  servers: [
    {
      url: PORT ? `http://localhost:${PORT}` : "http://localhost:9000",
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
      userAuth: [],
    },
  ],
});

export const yaml = document;
