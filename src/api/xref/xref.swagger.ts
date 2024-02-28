import { ZodOpenApiOperationObject } from 'zod-openapi';
import { z } from 'zod';
import { SwagDesc, SwagErr, SwagUnauthorized } from '../../utils/swagger_helpers';
import { tsnQuerySchema, XrefCollectionUnitSchema, XrefTaxonCollectionCategorySchema } from '../../utils/zod_helpers';
import {
  CollectionUnitCategoryIdSchema,
  CollectionUnitCategorySchema,
  TsnMarkingBodyLocationSchema,
  TsnMeasurementsSchema,
  TsnQualitativeMeasurementSchema,
  TsnQuantitativeMeasurementSchema
} from '../../schemas/xref-schema';
import { routes } from '../../utils/constants';
import { QueryFormats } from '../../utils/types';

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

const getXrefCollectionUnits: ZodOpenApiOperationObject = {
  operationId: 'getXrefCollectionUnits',
  summary:
    'Get all collection units available in the DB. To filter by category, provide either just a category_id, or provide a category name plus a taxon_name_latin or taxon_name_common.',
  tags: [TAG],
  requestParams: {
    query: CollectionUnitCategorySchema.extend({
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
    get: getTsnQualitativeMeasurements
  },
  [`${routes.xref}/taxon-quantitative-measurements`]: {
    get: getTsnQuantitativeMeasurements
  },
  [`${routes.xref}/taxon-measurements`]: {
    get: getTsnMeasurements
  }
};
