import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import {
  artifactSchema,
  ArtifactCreateBodySchema,
  ArtifactUpdateBodySchema,
} from "./artifact.utils";
import { SwagDesc, SwagErr, SwagNotFound } from "../../utils/swagger_helpers";
import { routes } from "../../utils/constants";

const getArtifacts = {
  operationId: "getArtifacts",
  summary: "Get all artifacts",
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: {},
        },
      },
    },
    ...SwagErr,
    ...SwagNotFound,
  },
};

export const artifactPaths = {
  [`${routes.artifacts}`]: {
    get: getArtifacts,
  },
};
