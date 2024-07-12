import { z } from 'zod';
import { zodID } from '../../utils/zod_helpers';
import { UserSchema, CreateUserSchema, UpdateUserSchema } from '../../schemas/user-schema';
import { SwagDesc, SwagErr, SwagNotFound, SwagUnauthorized } from '../../utils/swagger_helpers';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import { routes } from '../../utils/constants';

const TAG = 'User';

const createUser: ZodOpenApiOperationObject = {
  operationId: 'createUser',
  summary: 'Creates a new user',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: CreateUserSchema
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: UserSchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const getUser: ZodOpenApiOperationObject = {
  operationId: 'getUser',
  summary: 'Gets a specific user by their id',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: UserSchema
        }
      }
    },
    ...SwagNotFound,
    ...SwagUnauthorized
  }
};

const updateUser: ZodOpenApiOperationObject = {
  operationId: 'updateUser',
  summary: 'Updates a specific user',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  requestBody: {
    content: {
      'application/json': {
        schema: UpdateUserSchema
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.update,
      content: {
        'application/json': {
          schema: UserSchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

export const userPaths = {
  [routes.users + '/create']: {
    post: createUser
  },
  [routes.users + '/{id}']: {
    get: getUser,
    patch: updateUser
  }
};
