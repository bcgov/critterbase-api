import { ZodOpenApiOperationObject } from "zod-openapi";

import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import {
  CaptureCreateSchema,
  CaptureResponseSchema,
  CaptureUpdateSchema,
} from "./capture.utils";
import { SwagDesc, SwagErr, SwagNotFound } from "../../utils/swagger_helpers";

const getCaptures: ZodOpenApiOperationObject = {
  operationId: "getCaptures",
  summary: "Get all captures",
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: z.array(CaptureResponseSchema),
        },
      },
    },
  },
};

const createCapture: ZodOpenApiOperationObject = {
  operationId: "createCapture",
  summary: "Create a capture event",
  requestBody: {
    content: {
      "application/json": {
        schema: CaptureCreateSchema,
      },
    },
  },
  responses: {
    "201": {
      description: SwagDesc.create,
      content: {
        "application/json": {
          schema: CaptureResponseSchema,
        },
      },
    },
    ...SwagErr,
  },
};

const getCaptureByCritterId: ZodOpenApiOperationObject = {
  operationId: "getCaptureByCritterId",
  summary: "Get captures by critter id",
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: z.array(CaptureResponseSchema),
        },
      },
    },
    ...SwagErr,
    ...SwagNotFound,
  },
};

const getCaptureById: ZodOpenApiOperationObject = {
  operationId: "getCaptureById",
  summary: "Get a capture by id",
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: CaptureResponseSchema,
        },
      },
    },
    ...SwagNotFound,
  },
};

const updateCapture: ZodOpenApiOperationObject = {
  operationId: "updateCapture",
  summary: "Update a capture",
  requestParams: {
    path: z.object({ id: zodID }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: CaptureUpdateSchema,
      },
    },
  },
  responses: {
    "200": {
      description: SwagDesc.update,
      content: {
        "application/json": {
          schema: CaptureResponseSchema,
        },
      },
    },
    ...SwagErr,
    ...SwagNotFound,
  },
};

const deleteCapture: ZodOpenApiOperationObject = {
  operationId: "deleteCapture",
  summary: "Delete a capture",
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.delete,
      content: {
        "application/json": {
          schema: CaptureResponseSchema,
        },
      },
    },
    ...SwagNotFound,
  },
};

export const capturePaths = {
  "/captures": {
    get: getCaptures,
  },
  "/captures/create": {
    post: createCapture,
  },
  "/captures/critter/:id": {
    get: getCaptureByCritterId,
  },
  "/captures/:id": {
    get: getCaptureById,
    put: updateCapture,
    delete: deleteCapture,
  },
};
