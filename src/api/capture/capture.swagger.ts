import { ZodOpenApiOperationObject } from "zod-openapi";

import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import { CaptureResponseSchema } from "./capture.utils";

const getCaptures: ZodOpenApiOperationObject = {
  operationId: "getCaptures",
  summary: "Get all captures",
  responses: {
    "200": {
      description: "Successful operation",
      content: {
        "application/json": {
          schema: CaptureResponseSchema,
        },
      },
    },
  },
};

export const capturePaths = {
  "/captures": {
    get: getCaptures,
  },
};
