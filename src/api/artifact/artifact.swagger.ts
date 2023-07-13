import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import {
  ArtifactCreateBodySchema,
  ArtifactUpdateBodySchema,
  SwagArtifactResponseSchema,
} from "./artifact.utils";
import {
  SwagDesc,
  SwagErr,
  SwagNotFound,
  SwagServerError,
  SwagUnauthorized,
} from "../../utils/swagger_helpers";
import { routes } from "../../utils/constants";

const TAG = "Artifact";

const getArtifacts: ZodOpenApiOperationObject = {
  operationId: "getArtifacts",
  summary: "Gets all artifacts",
  tags: [TAG],
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwagArtifactResponseSchema.array(),
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagServerError,
  },
};

const createArtifact: ZodOpenApiOperationObject = {
  operationId: "createArtifact",
  summary:
    "Creates a new artifact in Critterbase and stores the file in Object Store",
  tags: [TAG],
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: ArtifactCreateBodySchema.extend({
          artifact: z.object({
            type: z.literal("string"),
            format: z.literal("binary"),
          }),
        }),
      },
    },
  },
  responses: {
    "200": {
      description: SwagDesc.create,
      content: {
        "application/json": {
          schema: SwagArtifactResponseSchema,
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagServerError,
    ...SwagNotFound,
  },
};

const getArtifactsByCritterId: ZodOpenApiOperationObject = {
  operationId: "getArtifactsByCritterId",
  summary: "Gets all artifacts with a specific critter id",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwagArtifactResponseSchema.array(),
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagServerError,
    ...SwagNotFound,
  },
};

const getArtifactById: ZodOpenApiOperationObject = {
  operationId: "getArtifactById",
  summary: "Gets a specifc artifact by its id",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwagArtifactResponseSchema,
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagServerError,
    ...SwagNotFound,
  },
};

const updateArtifact: ZodOpenApiOperationObject = {
  operationId: "updateArtifact",
  summary: "Updates a specific artifacts data",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: ArtifactUpdateBodySchema,
      },
    },
  },
  responses: {
    "200": {
      description: SwagDesc.update,
      content: {
        "application/json": {
          schema: SwagArtifactResponseSchema,
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagServerError,
    ...SwagNotFound,
  },
};

const deleteArtifact: ZodOpenApiOperationObject = {
  operationId: "deleteArtifact",
  summary: "Deletes a specific artifact",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.delete,
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagServerError,
    ...SwagNotFound,
  },
};

export const artifactPaths = {
  [`${routes.artifacts}`]: {
    get: getArtifacts,
  },
  [`${routes.artifacts}/create`]: {
    post: createArtifact,
  },
  [`${routes.artifacts}/critter/{id}`]: {
    get: getArtifactsByCritterId,
  },
  [`${routes.artifacts}/{id}`]: {
    get: getArtifactById,
    patch: updateArtifact,
    delete: deleteArtifact,
  },
};
