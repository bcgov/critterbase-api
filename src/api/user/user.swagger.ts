import { ZodOpenApiOperationObject } from "zod-openapi";
import { z } from "zod";
import { zodID } from "../../utils/zod_helpers";
import {
  UserCreateBodySchema,
  UserUpdateBodySchema,
  SwagUserSchema,
} from "./user.utils";
import { SwagDesc, SwagErr, SwagNotFound } from "../../utils/swagger_helpers";
import { routes } from "../../utils/constants";

const TAG = "User";

const getUsers: ZodOpenApiOperationObject = {
  operationId: "getUsers",
  summary: "Gets all users",
  tags: [TAG],
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwagUserSchema.array(),
        },
      },
    },
  },
};

const createUser: ZodOpenApiOperationObject = {
  operationId: "createUser",
  summary: "Creates a new user",
  tags: [TAG],
  requestBody: {
    content: {
      "application/json": {
        schema: UserCreateBodySchema,
      },
    },
  },
  responses: {
    "200": {
      description: SwagDesc.create,
      content: {
        "application/json": {
          schema: SwagUserSchema,
        },
      },
    },
    ...SwagErr,
    ...SwagNotFound,
  },
};

const getUser: ZodOpenApiOperationObject = {
  operationId: "getUser",
  summary: "Gets a specific user by their id",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.get,
      content: {
        "application/json": {
          schema: SwagUserSchema,
        },
      },
    },
    ...SwagNotFound,
  },
};

const updateUser: ZodOpenApiOperationObject = {
  operationId: "updateUser",
  summary: "Updates a specific user",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  requestBody: {
    content: {
      "application/json": {
        schema: UserUpdateBodySchema,
      },
    },
  },
  responses: {
    "200": {
      description: SwagDesc.update,
      content: {
        "application/json": {
          schema: SwagUserSchema,
        },
      },
    },
    ...SwagErr,
    ...SwagNotFound,
  },
};

const deleteUser: ZodOpenApiOperationObject = {
  operationId: "deleteUser",
  summary: "Deletes a specific user",
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID }),
  },
  responses: {
    "200": {
      description: SwagDesc.delete,
      content: {
        "application/json": {
          schema: SwagUserSchema,
        },
      },
    },
    ...SwagNotFound,
  },
};

export const userPaths = {
  [routes.users]: {
    get: getUsers,
  },
  [routes.users + "/create"]: {
    post: createUser,
  },
  [routes.users + "/{id}"]: {
    get: getUser,
    patch: updateUser,
    delete: deleteUser,
  },
};
