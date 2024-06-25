import { z } from 'zod';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import { routes } from '../../utils/constants';
import { SwagDesc, SwagErr, SwagNotFound, SwagUnauthorized } from '../../utils/swagger_helpers';
import { zodID } from '../../utils/zod_helpers';
import {
  MarkingCreateBodySchema,
  MarkingUpdateBodySchema,
  MarkingVerificationSchema,
  markingIncludesSchema
} from './marking.utils';

const TAG = 'Markings';
const SwaggerMarkingResponseValidation = markingIncludesSchema
  .omit({
    lk_colour_marking_primary_colour_idTolk_colour: true,
    lk_colour_marking_secondary_colour_idTolk_colour: true,
    lk_colour_marking_text_colour_idTolk_colour: true,
    lk_marking_type: true,
    lk_marking_material: true,
    xref_taxon_marking_body_location: true
  })
  .extend({
    body_location: z.string().nullable(),
    marking_type: z.string().nullable(),
    marking_material: z.string().nullable(),
    primary_colour: z.string().nullable(),
    secondary_colour: z.string().nullable(),
    text_colour: z.string().nullable()
  });

const getMarkingById: ZodOpenApiOperationObject = {
  operationId: 'getMarkingById',
  summary: 'Get a marking by id',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: SwaggerMarkingResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const updateMarkingById: ZodOpenApiOperationObject = {
  operationId: 'updateMarkingById',
  summary: 'Update a marking by id',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  requestBody: {
    content: {
      'application/json': {
        schema: MarkingUpdateBodySchema
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.update,
      content: {
        'application/json': {
          schema: SwaggerMarkingResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const deleteMarkingById: ZodOpenApiOperationObject = {
  operationId: 'deleteMarkingById',
  summary: 'Delete a marking by id',
  tags: [TAG],
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: SwagDesc.delete,
      content: {
        'application/json': {
          schema: SwaggerMarkingResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const getMarkingsByCritterId: ZodOpenApiOperationObject = {
  operationId: 'getMarkingsByCritterId',
  tags: [TAG],
  summary: 'Get all markings attached to the critter using the provided critter id.',
  requestParams: {
    path: z.object({ id: zodID })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: SwaggerMarkingResponseValidation.array()
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const verifyMarkings: ZodOpenApiOperationObject = {
  operationId: 'verifyMarkings',
  tags: [TAG],
  summary: `Verify whether the supplied markings can be attached to a specific tsn.
  If all markings pass, verified is true.
  If not, verified is false and invalid_markings contains primary id of problematic markings.`,
  requestBody: {
    content: {
      'application/json': {
        schema: MarkingVerificationSchema
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: z.object({
            verified: z.boolean(),
            invalid_marking: zodID.array()
          })
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const createMarking: ZodOpenApiOperationObject = {
  operationId: 'createMarking',
  tags: [TAG],
  summary: 'Create a marking.',
  requestBody: {
    content: {
      'application/json': {
        schema: MarkingCreateBodySchema
      }
    }
  },
  responses: {
    '200': {
      description: SwagDesc.create,
      content: {
        'application/json': {
          schema: SwaggerMarkingResponseValidation
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const getAllMarkings: ZodOpenApiOperationObject = {
  operationId: 'getAllMarkings',
  tags: [TAG],
  summary: 'Get all markings from the db.',
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: SwaggerMarkingResponseValidation.array()
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

export const markingPaths = {
  [`${routes.markings}`]: {
    get: getAllMarkings
  },
  [`${routes.markings}/create`]: {
    post: createMarking
  },
  [`${routes.markings}/verify`]: {
    get: verifyMarkings
  },
  [`${routes.markings}/critter/{id}`]: {
    post: getMarkingsByCritterId
  },
  [`${routes.markings}/{id}`]: {
    get: getMarkingById,
    patch: updateMarkingById,
    delete: deleteMarkingById
  }
};
