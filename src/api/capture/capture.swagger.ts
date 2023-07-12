import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import {
  CaptureCreateSchema,
  CaptureIncludeSchema,
  CaptureUpdateSchema,
} from "./capture.utils";
import { CommonLocationValidation } from "../location/location.utils";

export const SwaggerCaptureResponseValidation = CaptureIncludeSchema.omit({
  location_capture_capture_location_idTolocation: true,
  location_capture_release_location_idTolocation: true,
}).extend({
  capture_location: CommonLocationValidation.nullable(),
  release_location: CommonLocationValidation.nullable(),
});
import { SwagDesc, SwagErr, SwagNotFound } from "../../utils/swagger_helpers";
import { routes } from "../../utils/constants";

const TAG = "Capture";

const getCaptures: ZodOpenApiOperationObject = {
  operationId: "getCaptures",
  summary: "Gets all capture events",
  tags: [TAG],
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: z.array(SwaggerCaptureResponseValidation),
        },
      },
    },
  },
};

const createCapture: ZodOpenApiOperationObject = {
  operationId: "createCapture",
  summary: "Creates a new capture event",
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
          schema: SwaggerCaptureResponseValidation,
        },
      },
    },
    ...SwagErr,
  },
};

const getCaptureByCritterId: ZodOpenApiOperationObject = {
  operationId: "getCaptureByCritterId",
  summary: "Gets all captures with a specific critter id",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: z.array(SwaggerCaptureResponseValidation),
        },
      },
    },
    ...SwagErr,
    ...SwagNotFound,
  },
};

const getCaptureById: ZodOpenApiOperationObject = {
  operationId: "getCaptureById",
  summary: "Gets a specifc capture event by its id",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation,
        },
      },
    },
    ...SwagNotFound,
  },
};

const updateCapture: ZodOpenApiOperationObject = {
  operationId: "updateCapture",
  summary: "Updates a specific capture event",
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
          schema: SwaggerCaptureResponseValidation,
        },
      },
    },
    ...SwagErr,
    ...SwagNotFound,
  },
};

const deleteCapture: ZodOpenApiOperationObject = {
  operationId: "deleteCapture",
  summary: "Delete a specific capture event",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.delete,
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation,
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
  [`${routes.captures}/critter/{id}`]: {
    get: getCaptureByCritterId,
  },
  [`${routes.captures}/{id}`]: {
    get: getCaptureById,
    put: updateCapture,
    delete: deleteCapture,
  },
};
