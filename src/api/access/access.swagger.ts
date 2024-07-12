import { z } from 'zod';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import { routes } from '../../utils/constants';
import { SwagDesc, SwagErr, SwagNotFound } from '../../utils/swagger_helpers';

const TAG = 'Access';

const getAccess: ZodOpenApiOperationObject = {
  operationId: 'getAccess',
  summary: 'Welcomes users to the API',
  security: [],
  tags: [TAG],
  responses: {
    200: {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: z.string()
        }
      }
    }
  }
};

const getTypes: ZodOpenApiOperationObject = {
  operationId: 'getTypes',
  summary: 'Gets types of all supported routes',
  security: [],
  tags: [TAG],
  requestParams: {
    path: z.object({ model: z.string() })
  },

  responses: {
    200: {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: z
            .object({
              column_name: z.string(),
              udt_name: z.string(),
              enum_vals: z.string().array()
            })
            .array()
        }
      }
    },
    ...SwagErr,
    ...SwagNotFound
  }
};

export const accessPaths = {
  [routes.home]: {
    get: getAccess
  },
  [routes.home + '/types/{model}']: {
    get: getTypes
  }
};
