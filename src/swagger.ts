import { createDocument } from "zod-openapi";
import { collectionUnitsPaths } from "./api/collectionUnit/collectionUnit.swagger";
import { critterPaths, critterSchemas } from "./api/critter/critter.swagger";
import { capturePaths } from "./api/capture/capture.swagger";
import { bulkPaths } from "./api/bulk/bulk.swagger";
import { artifactPaths } from "./api/artifact/artifact.swagger";
import { locationPaths } from "./api/location/location.swagger";
import { userPaths } from "./api/user/user.swagger";
import { PORT } from "./utils/constants";

const document = createDocument({
  openapi: "3.1.0",
  components: {
    schemas: {
      ...critterSchemas,
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
    ...collectionUnitsPaths,
    ...critterPaths,
    ...capturePaths,
    ...bulkPaths,
    ...artifactPaths,
    ...locationPaths,
    ...userPaths,
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
});
//console.log(stringify(document));
export const yaml = document;
