import { z } from 'zod';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import { routes } from '../../utils/constants';
import { SwagDesc, SwagErr, SwagNotFound, SwagUnauthorized } from '../../utils/swagger_helpers';
import { zodID } from '../../utils/zod_helpers';
import {
  CollectionUnitCreateBodySchema,
  CollectionUnitUpdateBodySchema,
  critter_collection_unitIncludesSchema
} from './collectionUnit.utils';

const SwaggerCollectionResponseValidation = critter_collection_unitIncludesSchema
  .omit({ collection_unit_id: true, xref_collection_unit: true })
  .extend({
    unit_name: z.string().nullable(),
    unit_description: z.string().nullable()
  });

const TAG = 'Collection units';

const getCollectionUnits: ZodOpenApiOperationObject = {
  operationId: 'getCollectionUnit',
  summary: 'Get a collection unit by id',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: SwaggerCollectionResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const getAllCollectionUnits: ZodOpenApiOperationObject = {
  operationId: 'getCollectionUnits',
  summary: 'Get every critter collection unit entry.',
  tags: [TAG],
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: SwaggerCollectionResponseValidation.array()
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const createCollectionUnit: ZodOpenApiOperationObject = {
  operationId: 'createCollectionUnit',
  summary: 'Associate an existing critter with a compatible collection unit.',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: CollectionUnitCreateBodySchema
      }
    }
  },
  responses: {
    '201': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: SwaggerCollectionResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const updateCollectionUnit: ZodOpenApiOperationObject = {
  operationId: 'updateCollectionUnit',
  summary:
    'Update a collection unit association. You may change which collection unit is associated here, but you may not change the critter.',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  requestBody: {
    content: {
      'application/json': {
        schema: CollectionUnitUpdateBodySchema
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.update,
      content: {
        'application/json': {
          schema: SwaggerCollectionResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const deleteCollectionUnit: ZodOpenApiOperationObject = {
  operationId: 'deleteCollectionUnit',
  summary: 'Deletes a critter collection unit association.',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: SwagDesc.delete,
      content: {
        'application/json': {
          schema: SwaggerCollectionResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const getCollectionUnitsByCritterId: ZodOpenApiOperationObject = {
  operationId: 'getCollectionUnitsByCritterId',
  summary: 'Get all critter collection units associated with the provided critter id.',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: SwaggerCollectionResponseValidation.array()
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

export const collectionUnitsPaths = {
  [`${routes.collection_units}`]: {
    get: getAllCollectionUnits
  },
  [`${routes.collection_units}/create`]: {
    post: createCollectionUnit
  },
  [`${routes.collection_units}/critter/{id}`]: {
    get: getCollectionUnitsByCritterId
  },
  [`${routes.collection_units}/{id}`]: {
    get: getCollectionUnits,
    patch: updateCollectionUnit,
    delete: deleteCollectionUnit
  }
};
