import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import { UserCreateBodySchema } from "../user/user.utils";
import { SwagDesc, SwagErr } from "../../utils/swagger_helpers";
import { routes } from "../../utils/constants";

const TAG = "Access";

const getAccess: ZodOpenApiOperationObject = {
  operationId: "getAccess",
  summary: "Welcome to the API",
  security: [],
  tags: [TAG],
  responses: {
    200: {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
};

const signup: ZodOpenApiOperationObject = {
  operationId: "signup",
  summary: "Sign up a new user",
  security: [],
  tags: [TAG],
  requestBody: {
    content: {
      "application/json": {
        schema: UserCreateBodySchema,
      },
    },
  },
  responses: {
    201: {
      description: SwagDesc.create,
      content: {
        "application/json": {
          schema: z.object({ user_id: zodID }),
        },
      },
    },
    ...SwagErr,
  },
};

const getTypes: ZodOpenApiOperationObject = {
  operationId: "getTypes",
  summary: "Get types of supported routes",
  security: [],
  tags: [TAG],
  requestParams: {
    path: z.object({ model: z.string() }),
  },

  responses: {
    200: {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: {},
        },
      },
    },
  },
};

export const accessPaths = {
  [routes.home]: {
    get: getAccess,
  },
  [routes.home + "/types/:model"]: {
    get: getTypes,
  },
  [routes.home + "/signup"]: {
    post: signup,
  },
};
