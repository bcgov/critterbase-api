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

const getCaptures: ZodOpenApiOperationObject = {
  operationId: "getCaptures",
  summary: "Get all captures",
  responses: {
    "200": {
      description: "Successful operation",
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
      description: "Successful operation",
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation,
        },
      },
    },
  },
};

const getCaptureByCritterId: ZodOpenApiOperationObject = {
  operationId: "getCaptureByCritterId",
  summary: "Get captures by critter id",
  responses: {
    "200": {
      description: "Successful operation",
      content: {
        "application/json": {
          schema: z.array(SwaggerCaptureResponseValidation),
        },
      },
    },
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
      description: "Successful operation",
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation,
        },
      },
    },
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
      description: "Successful operation",
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation,
        },
      },
    },
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
      description: "Successful operation",
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation,
        },
      },
    },
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
