import { z } from 'zod';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import {
  CollectionUnitCategoryIdSchema,
  MeasurementIdsQuerySchema,
  MeasurementSearchQuery,
  MeasurementsWithTsnHierarchy,
  TsnMarkingBodyLocationSchema,
  TsnMeasurementsSchema,
  TsnQualitativeMeasurementSchema,
  TsnQuantitativeMeasurementSchema
} from '../../schemas/xref-schema';
import { routes } from '../../utils/constants';
import { SwagDesc, SwagErr, SwagUnauthorized } from '../../utils/swagger_helpers';
import { QueryFormats } from '../../utils/types';
import { XrefCollectionUnitSchema, XrefTaxonCollectionCategorySchema, tsnQuerySchema } from '../../utils/zod_helpers';

const TAG = 'Xref';

export const xrefSchemas = {
  xrefCollectionUnitsDefaultSchema: XrefCollectionUnitSchema.array(),
  xrefCollectionTaxonCategoryDefaultSchema: XrefTaxonCollectionCategorySchema.array(),
  xrefTaxonMarkingLocationDefaultSchema: TsnMarkingBodyLocationSchema.array(),
  xrefTsnQualitativeMeasurementSchema: TsnQualitativeMeasurementSchema.array(),
  xrefTsnQuantitativeMeasurementSchema: TsnQuantitativeMeasurementSchema.array(),
  xrefTsnMeasurementsSchema: TsnMeasurementsSchema
};

const formats = z.enum([QueryFormats.asSelect]).optional();

const searchMeasurements: ZodOpenApiOperationObject = {
  operationId: 'searchMeasurements',
  summary:
    'Search for measurements by properties. Currently only supports measurement name. Payload returns tsn hierarchy for each measurement.',
  tags: [TAG],
  requestParams: {
    query: MeasurementSearchQuery
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: MeasurementsWithTsnHierarchy
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const getXrefCollectionUnits: ZodOpenApiOperationObject = {
  operationId: 'getXrefCollectionUnits',
  summary:
    'Get all collection units available in the DB. To filter by category, provide either just a category_id, or provide a category name plus a taxon_name_latin or taxon_name_common.',
  tags: [TAG],
  requestParams: {
    query: CollectionUnitCategoryIdSchema.extend({
      category_name: z.string().optional(),
      ...CollectionUnitCategoryIdSchema.shape,
      format: formats
    })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: {
            oneOf: [
              { $ref: '#/components/schemas/xrefCollectionUnitsDefaultSchema' },
              { $ref: '#/components/schemas/asSelectSchema' }
            ]
          }
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const getCollectionTaxonCategories: ZodOpenApiOperationObject = {
  operationId: 'getCollectionTaxonCategories',
  summary:
    'Get all collection to taxon category mappings available in the DB. A single taxon may have multiple different types of collection units available to them.',
  tags: [TAG],
  requestParams: {
    query: tsnQuerySchema.extend({
      format: z.enum([QueryFormats.asSelect]).optional()
    })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                $ref: '#/components/schemas/xrefCollectionTaxonCategoryDefaultSchema'
              },
              { $ref: '#/components/schemas/asSelectSchema' }
            ]
          }
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const getTaxonMarkingBodyLocations: ZodOpenApiOperationObject = {
  operationId: 'getTaxonMarkingBodyLocations',
  summary:
    "Get all marking body locations of a TSN. Includes body locations of parent TSN's. Additional asSelect format available.",
  tags: [TAG],
  requestParams: {
    query: z.object({
      tsn: z.number(),
      format: z.literal(QueryFormats.asSelect).optional()
    })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                $ref: '#/components/schemas/xrefTaxonMarkingLocationDefaultSchema'
              },
              { $ref: '#/components/schemas/asSelectSchema' }
            ]
          }
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const getTsnQualitativeMeasurements: ZodOpenApiOperationObject = {
  operationId: 'getTsnQualitativeMeasurements',
  summary:
    "Get all qualitative measurements of a TSN. Includes measurements of parent TSN's. Additional asSelect format available.",
  tags: [TAG],
  requestParams: {
    query: z.object({
      tsn: z.number(),
      format: z.literal(QueryFormats.asSelect).optional()
    })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                $ref: '#/components/schemas/xrefTsnQualitativeMeasurementSchema'
              },
              { $ref: '#/components/schemas/asSelectSchema' }
            ]
          }
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const getTsnQuantitativeMeasurements: ZodOpenApiOperationObject = {
  operationId: 'getTsnQuantitativeMeasurements',
  summary:
    "Get all quantitative measurements of a TSN. Includes measurements of parent TSN's. Additional asSelect format available.",
  tags: [TAG],
  requestParams: {
    query: z.object({
      tsn: z.number(),
      format: z.literal(QueryFormats.asSelect).optional()
    })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                $ref: '#/components/schemas/xrefTsnQuantitativeMeasurementSchema'
              },
              { $ref: '#/components/schemas/asSelectSchema' }
            ]
          }
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const getQuantitativeMeasurementsByIds: ZodOpenApiOperationObject = {
  operationId: 'getTsnQuantitativeMeasurementsByIds',
  summary: 'Get quantitative measurements by taxon measurement ids.',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: MeasurementIdsQuerySchema
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
              {
                $ref: '#/components/schemas/xrefTsnQuantitativeMeasurementSchema'
              },
              { $ref: '#/components/schemas/asSelectSchema' }
            ]
          }
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const getQualitativeMeasurementsByIds: ZodOpenApiOperationObject = {
  operationId: 'getQualitativeMeasurementsByIds',
  summary: 'Get qualitative measurements by taxon measurement ids.',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: MeasurementIdsQuerySchema
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
              {
                $ref: '#/components/schemas/xrefTsnQualitativeMeasurementSchema'
              },
              { $ref: '#/components/schemas/asSelectSchema' }
            ]
          }
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

const getTsnMeasurements: ZodOpenApiOperationObject = {
  operationId: 'getTsnMeasurements',
  summary:
    "Get all measurements of a TSN. Includes measurements of parent TSN's. Additional asSelect format available.",
  tags: [TAG],
  requestParams: {
    query: z.object({
      tsn: z.number(),
      format: z.literal(QueryFormats.asSelect).optional()
    })
  },
  responses: {
    '200': {
      description: SwagDesc.get,
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                $ref: '#/components/schemas/xrefTsnMeasurementsSchema'
              },
              { $ref: '#/components/schemas/asSelectSchemaWithChildren' }
            ]
          }
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized
  }
};

export const xrefPaths = {
  [`${routes.xref}/collection-units`]: {
    get: getXrefCollectionUnits
  },
  [`${routes.xref}/taxon-collection-categories`]: {
    get: getCollectionTaxonCategories
  },
  [`${routes.xref}/taxon-marking-body-locations`]: {
    get: getTaxonMarkingBodyLocations
  },
  [`${routes.xref}/taxon-qualitative-measurements`]: {
    get: getTsnQualitativeMeasurements,
    post: getQualitativeMeasurementsByIds
  },
  [`${routes.xref}/taxon-quantitative-measurements`]: {
    get: getTsnQuantitativeMeasurements,
    post: getQuantitativeMeasurementsByIds
  },
  [`${routes.xref}/taxon-measurements`]: {
    get: getTsnMeasurements
  },
  [`${routes.xref}/taxon-measurements/search`]: {
    get: searchMeasurements
  }
};
