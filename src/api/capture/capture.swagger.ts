import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import {
  CaptureCreateSchema,
  CaptureIncludeSchema,
  CaptureUpdateSchema
} from "./capture.utils";
import { CommonLocationValidation } from "../location/location.utils";

export const SwaggerCaptureResponseValidation = CaptureIncludeSchema.omit({
  location_capture_capture_location_idTolocation: true,
  location_capture_release_location_idTolocation: true
}).extend({
  capture_location: CommonLocationValidation.nullable(),
  release_location: CommonLocationValidation.nullable()
});
import {
  SwagDesc,
  SwagErr,
  SwagNotFound,
  SwagUnauthorized
} from "../../utils/swagger_helpers";
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
          schema: z.array(SwaggerCaptureResponseValidation)
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const createCapture: ZodOpenApiOperationObject = {
  operationId: "createCapture",
  summary:
    "Creates a new capture event. Note that it is possible to nest location creation data here, which will automatically create and link location rows to this capture.",
  tags: [TAG],
  requestBody: {
    content: {
      "application/json": {
        schema: CaptureCreateSchema
      }
    }
  },
  responses: {
    "201": {
      description: SwagDesc.create,
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const getCaptureByCritterId: ZodOpenApiOperationObject = {
  operationId: "getCaptureByCritterId",
  summary: "Gets all captures with a specific critter id",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: z.array(SwaggerCaptureResponseValidation)
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const getCaptureById: ZodOpenApiOperationObject = {
  operationId: "getCaptureById",
  summary: "Gets a specifc capture event by its id",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const updateCapture: ZodOpenApiOperationObject = {
  operationId: "updateCapture",
  summary: `Updates a specific capture event. 
  Note that it is possible to nest capture data, which will update the associated location data, or create new data if none is present.
  You can also force the creation of release data, useful in the case where capture event currently uses the same location record for both capture and release, but you wish to separate them.`,
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  requestBody: {
    content: {
      "application/json": {
        schema: CaptureUpdateSchema
      }
    }
  },
  responses: {
    "200": {
      description: SwagDesc.update,
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const deleteCapture: ZodOpenApiOperationObject = {
  operationId: "deleteCapture",
  summary: "Delete a specific capture event",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    "200": {
      description: SwagDesc.delete,
      content: {
        "application/json": {
          schema: SwaggerCaptureResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

export const capturePaths = {
  [routes.captures]: {
    get: getCaptures
  },
  [`${routes.captures}/create`]: {
    post: createCapture
  },
  [`${routes.captures}/critter/{id}`]: {
    get: getCaptureByCritterId
  },
  [`${routes.captures}/{id}`]: {
    get: getCaptureById,
    patch: updateCapture,
    delete: deleteCapture
  }
};
