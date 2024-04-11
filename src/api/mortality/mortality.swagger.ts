import { z } from 'zod';
import {
  MortalityCreateSchema,
  MortalityDetailedSchema,
  MortalitySchema,
  MortalityUpdateSchema
} from '../../schemas/mortality-schema';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import { zodID } from '../../utils/zod_helpers';
import { routes } from '../../utils/constants';
import { SwagDesc, SwagErr, SwagNotFound, SwagUnauthorized } from '../../utils/swagger_helpers';

const TAG = 'Mortalities';

const getAllMortalities: ZodOpenApiOperationObject = {
  operationId: 'getAllMortalities',
  summary: 'Get all mortalities available in the DB.',
  tags: [TAG],
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: z.array(MortalitySchema)
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const createMortality: ZodOpenApiOperationObject = {
  operationId: 'createMortality',
  summary:
    'Create a new mortality. Note that you may also nest location data, which will automatically create and link a location row.',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: MortalityCreateSchema
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: MortalitySchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const getMortalityByCritter: ZodOpenApiOperationObject = {
  operationId: 'getMortalityByCritter',
  summary: 'Get all mortalities associated with the provided critter id.',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: 'Retrieved all mortalities for this critter. Should only be one in most cases.',
      content: {
        'application/json': {
          schema: MortalityDetailedSchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const getMortalityById: ZodOpenApiOperationObject = {
  operationId: 'getMortalityById',
  summary: 'Get a mortality by ID.',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: MortalityDetailedSchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const updateMortality: ZodOpenApiOperationObject = {
  operationId: 'updateMortality',
  summary:
    'Update a mortality by ID. Note that you may also nest location data, which will update an existing associated location row, or create one if it does not exist.',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  requestBody: {
    content: {
      'application/json': {
        schema: MortalityUpdateSchema
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.update,
      content: {
        'application/json': {
          schema: MortalitySchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const deleteMortality: ZodOpenApiOperationObject = {
  operationId: 'deleteMortality',
  summary: 'Delete a mortality by ID.',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: SwagDesc.delete,
      content: {
        'application/json': {
          schema: MortalitySchema
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

export const mortalityPaths = {
  [`${routes.mortality}`]: {
    get: getAllMortalities
  },
  [`${routes.mortality}/create`]: {
    post: createMortality
  },
  [`${routes.mortality}/critter/{id}`]: {
    get: getMortalityByCritter
  },
  [`${routes.mortality}/{id}`]: {
    get: getMortalityById,
    patch: updateMortality,
    delete: deleteMortality
  }
};
