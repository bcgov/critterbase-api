import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import {
  ArtifactCreateBodySchema,
  ArtifactUpdateBodySchema,
  SwagArtifactResponseSchema,
} from "./artifact.utils";
import { SwagDesc, SwagErr, SwagNotFound } from "../../utils/swagger_helpers";
import { routes } from "../../utils/constants";

const TAG = "Artifact";

const getArtifacts: ZodOpenApiOperationObject = {
  operationId: "getArtifacts",
  summary: "Get all artifacts",
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
    ...SwagNotFound,
  },
};

const createArtifact: ZodOpenApiOperationObject = {
  operationId: "createArtifact",
  summary: "Create an artifact",
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
    ...SwagNotFound,
  },
};

const getArtifactsByCritterId: ZodOpenApiOperationObject = {
  operationId: "getArtifactsByCritterId",
  summary: "Get all artifacts by critter id",
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
    ...SwagNotFound,
  },
};

const getArtifactById: ZodOpenApiOperationObject = {
  operationId: "getArtifactById",
  summary: "Get an artifact by id",
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
    ...SwagNotFound,
  },
};

const updateArtifact: ZodOpenApiOperationObject = {
  operationId: "updateArtifact",
  summary: "Update an artifact",
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
    ...SwagNotFound,
  },
};

const deleteArtifact: ZodOpenApiOperationObject = {
  operationId: "deleteArtifact",
  summary: "Delete an artifact",
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
  [`${routes.artifacts}/critter/:id`]: {
    get: getArtifactsByCritterId,
  },
  [`${routes.artifacts}/:id`]: {
    get: getArtifactById,
    patch: updateArtifact,
    delete: deleteArtifact,
  },
};
