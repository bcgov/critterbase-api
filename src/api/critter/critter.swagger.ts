import { z } from 'zod';
import {
  CreateCritterSchema,
  CritterIdsRequestSchema,
  DetailedCritterSchema,
  DetailedManyCritterSchema,
  GetCritterSchema,
  SimilarCritterQuerySchema,
  UpdateCritterSchema
} from '../../schemas/critter-schema';
import { CaptureMortalityGeometrySchema } from '../../schemas/spatial-schema';
import { routes } from '../../utils/constants';
import { SwagDesc, SwagErr, SwagNotFound, SwagUnauthorized } from '../../utils/swagger_helpers';
import { QueryFormats } from '../../utils/types';
import { zodID } from '../../utils/zod_helpers';

const TAG = 'Critter';

export const critterSchemas = {
  defaultCritterResponse: GetCritterSchema,
  detailedCritterResponse: DetailedCritterSchema,
  defaultCritterResponseArray: z.array(GetCritterSchema),
  detailedManyCritterResponseArray: z.array(DetailedManyCritterSchema),
  defaultCritterGeometryResponse: CaptureMortalityGeometrySchema
};

export const critterPaths = {
  [`${routes.critters}`]: {
    /**
     * Get all critters.
     *
     */
    get: {
      operationId: 'getAllCritters',
      summary: 'Fetch all critters available in critterbase',
      tags: [TAG],
      requestParams: {
        query: z.object({
          wlh_id: z.string().optional()
        })
      },
      responses: {
        '200': {
          description: 'Returned all critters successfully, or all critters matching WLH ID if provided.',
          content: {
            'application/json': {
              schema: GetCritterSchema.array()
            }
          }
        },
        '404': {
          description: 'Will return 404 if there were no critters matching a provided WLH ID'
        },
        ...SwagErr,
        ...SwagUnauthorized
      }
    },
    /**
     * Get all critters by list of critter ids.
     *
     */
    post: {
      operationId: 'crittersByIds',
      summary: 'Retrieve specific critters by a list of critter ids. Can optionally return a detailed response.',
      tags: [TAG],
      requestParams: {
        query: z.object({ format: z.enum([QueryFormats.detailed]).optional() })
      },
      requestBody: {
        content: {
          'application/json': {
            schema: CritterIdsRequestSchema
          }
        }
      },
      responses: {
        '200': {
          description: SwagDesc.get,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/defaultCritterResponseArray' },
                  { $ref: '#/components/schemas/detailedManyCritterResponseArray' }
                ]
              }
            }
          }
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound
      }
    }
  },
  [`${routes.critters}/spatial`]: {
    /**
     * Get capture and mortality geometry for multiple critter IDs
     *
     */
    post: {
      operationId: 'crittersGeometryByIds',
      summary: 'Retrieve capture and mortality geometry for specific critters by their critter ids.',
      tags: [TAG],
      requestBody: {
        content: {
          'application/json': {
            schema: CritterIdsRequestSchema
          }
        }
      },
      responses: {
        '200': {
          description: SwagDesc.get,
          content: {
            'application/json': {
              schema: {
                oneOf: [{ $ref: '#/components/schemas/defaultCritterGeometryResponse' }]
              }
            }
          }
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound
      }
    }
  },
  [`${routes.critters}/unique`]: {
    /**
     * Get list of critters by semi-unique attributes.
     *
     */
    post: {
      operationId: 'getUniqueCritters',
      summary: `Determine whether a critter is unique or not through various identifiable features.
    This endpoint will return an array of critters that may be partial matches to the info provided.
    Note that providing WLH ID will override the rest of the search and filter critters by WLH ID alone.`,
      tags: [TAG],
      requestBody: {
        content: {
          'application/json': {
            schema: SimilarCritterQuerySchema
          }
        }
      },
      responses: {
        '200': {
          description: 'Returned all critters successfully, or all critters matching WLH ID if provided.',
          content: {
            'application/json': {
              schema: GetCritterSchema.array()
            }
          }
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound
      }
    }
  },
  [`${routes.critters}/create`]: {
    /**
     * Create a critter.
     *
     */
    post: {
      operationId: 'createCritter',
      summary: 'Create a new critter',
      tags: [TAG],
      requestBody: {
        content: {
          'application/json': {
            schema: CreateCritterSchema
          }
        }
      },
      responses: {
        '201': {
          description: SwagDesc.create,
          content: {
            'application/json': {
              schema: GetCritterSchema
            }
          }
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound
      }
    }
  },
  [`${routes.critters}/{id}`]: {
    /**
     * Get a critter by id.
     *
     */
    get: {
      operationId: 'getCritterById',
      summary: 'Get a critter by id (critter_id)',
      tags: [TAG],
      requestParams: {
        path: z.object({ id: zodID }),
        query: z.object({ format: z.enum([QueryFormats.detailed]).optional() })
      },
      responses: {
        '200': {
          description: 'Successfully returned critter',
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/defaultCritterResponse' },
                  { $ref: '#/components/schemas/detailedCritterResponse' }
                ]
              }
            }
          }
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound
      }
    },
    /**
     * Update a critter.
     *
     */
    patch: {
      operationId: 'updateCritterById',
      summary: 'Update a critter by id',
      tags: [TAG],
      requestParams: {
        path: z.object({ id: zodID })
      },
      requestBody: {
        content: {
          'application/json': {
            schema: UpdateCritterSchema
          }
        }
      },
      responses: {
        '200': {
          description: SwagDesc.update,
          content: {
            'application/json': {
              schema: GetCritterSchema
            }
          }
        },
        ...SwagErr,
        ...SwagUnauthorized,
        ...SwagNotFound
      }
    }
  }
};
