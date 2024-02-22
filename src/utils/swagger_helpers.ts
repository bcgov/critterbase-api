import { z } from "zod";
import { ZodOpenApiOperationObject } from "zod-openapi";

const SwagMsg = {
  "application/json": {
    schema: z.object({ error: z.string() }),
  },
};

export const SwagDesc = {
  get: "Successful operation",
  create: "Created successfully",
  delete: "Deleted successfully",
  update: "Updated successfully",
  error: "Error occurred",
  error_unauthorized: "Unauthorized",
  error_not_found: "Requested resource was not found",
  error_server: "Internal server error",
};

export const SwagErr: ZodOpenApiOperationObject["responses"] = {
  "400": {
    description: SwagDesc.error,
    content: {
      "application/json": {
        schema: z.object({
          error: z.string().optional(), //update to include zodErrors
        }),
      },
    },
  },
};

export const SwagUnauthorized: ZodOpenApiOperationObject["responses"] = {
  "401": {
    description: SwagDesc.error_unauthorized,
    content: SwagMsg,
  },
};

export const SwagNotFound: ZodOpenApiOperationObject["responses"] = {
  "404": {
    description: SwagDesc.error_not_found,
    content: SwagMsg,
  },
};

export const SwagServerError: ZodOpenApiOperationObject["responses"] = {
  "500": {
    description: SwagDesc.error_server,
    content: SwagMsg,
  },
};
