import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import {
  CaptureCreateSchema,
  CaptureUpdateSchema,
  SwagCaptureResponseSchema,
} from "./capture.utils";
import { SwagDesc, SwagErr, SwagNotFound } from "../../utils/swagger_helpers";
import { routes } from "../../utils/constants";

const TAG = "Capture";

const getCaptures: ZodOpenApiOperationObject = {
  operationId: "getCaptures",
  summary: "Get all captures",
  tags: [TAG],
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: z.array(SwagCaptureResponseSchema),
        },
      },
    },
  },
};

const createCapture: ZodOpenApiOperationObject = {
  operationId: "createCapture",
  summary: "Create a capture event",
  tags: [TAG],
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
          schema: SwagCaptureResponseSchema,
        },
      },
    },
    ...SwagErr,
  },
};

const getCaptureByCritterId: ZodOpenApiOperationObject = {
  operationId: "getCaptureByCritterId",
  summary: "Get captures by critter id",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: z.array(SwagCaptureResponseSchema),
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
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwagCaptureResponseSchema,
        },
      },
    },
    ...SwagNotFound,
  },
};

const updateCapture: ZodOpenApiOperationObject = {
  operationId: "updateCapture",
  summary: "Update a capture",
  tags: [TAG],
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
          schema: SwagCaptureResponseSchema,
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
    ...SwagNotFound,
  },
};

export const capturePaths = {
  [routes.captures]: {
    get: getCaptures,
  },
  [`${routes.captures}/create`]: {
    post: createCapture,
  },
  [`${routes.captures}/critter/:id`]: {
    get: getCaptureByCritterId,
  },
  [`${routes.captures}/:id`]: {
    get: getCaptureById,
    put: updateCapture,
    delete: deleteCapture,
  },
};
