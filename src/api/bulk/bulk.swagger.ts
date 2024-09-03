import { z } from 'zod';
import { ZodOpenApiOperationObject } from 'zod-openapi';
import { CaptureCreateSchema, CaptureUpdateSchema } from '../../schemas/capture-schema';
import { BulkCritterCreateSchema, UpdateCritterSchema } from '../../schemas/critter-schema';
import { LocationCreateSchema, LocationUpdateSchema } from '../../schemas/location-schema';
import { MortalityCreateSchema, MortalityUpdateSchema } from '../../schemas/mortality-schema';
import { routes } from '../../utils/constants';
import { SwagErr, SwagNotFound, SwagUnauthorized } from '../../utils/swagger_helpers';
import { zodID } from '../../utils/zod_helpers';
import { CollectionUnitCreateBodySchema, CollectionUnitUpsertSchema } from '../collectionUnit/collectionUnit.utils';
import { MarkingCreateBodySchema } from '../marking/marking.utils';

const TAG = 'Bulk';
const bulkCreation: ZodOpenApiOperationObject = {
  operationId: 'bulkCreate',
  summary: 'Create multiple records in one batch, and rollback changes if any one entry fails.',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: z.object({
          critters: BulkCritterCreateSchema.array(),
          markings: MarkingCreateBodySchema.extend({
            primary_colour: z.string().optional(),
            secondary_colour: z.string().optional(),
            body_location: z.string().optional()
          }).array(),
          captures: CaptureCreateSchema.array(),
          locations: LocationCreateSchema.array(),
          mortalities: MortalityCreateSchema.extend({
            proximate_cause_of_death_id: zodID.optional()
          }).array(),
          collections: CollectionUnitCreateBodySchema.array()
        })
      }
    }
  },
  responses: {
    '200': {
      description: 'Successfully inserted all records.'
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

const bulkUpdate: ZodOpenApiOperationObject = {
  operationId: 'bulkUpdate',
  summary:
    'Update multiple records in one batch, and rollback changes if any one entry fails. You can also nest location updates inside capture entries, and delete rows for supported types.',
  tags: [TAG],
  requestBody: {
    content: {
      'application/json': {
        schema: z.object({
          critters: UpdateCritterSchema.extend({ critter_id: zodID }).array(),
          markings: MarkingCreateBodySchema.extend({
            marking_id: zodID.optional(),
            _delete: z.boolean().optional()
          }).array(),
          captures: CaptureUpdateSchema.array(),
          locations: LocationUpdateSchema.array(),
          mortalities: MortalityUpdateSchema.extend({
            proximate_cause_of_death_id: zodID.optional()
          }).array(),
          collections: CollectionUnitUpsertSchema.extend({
            _delete: z.boolean().optional()
          }).array()
        })
      }
    }
  },
  responses: {
    '200': {
      description: 'Successfully inserted all records.',
      content: {
        'application/json': {
          schema: z.object({
            updated: z.object({
              critters: z.number().optional(),
              markings: z.number().optional(),
              captures: z.number().optional(),
              locations: z.number().optional(),
              mortalities: z.number().optional(),
              collections: z.number().optional()
            }),
            deleted: z.object({
              markings: z.number().optional(),
              collections: z.number().optional()
            })
          })
        }
      }
    },
    ...SwagErr,
    ...SwagUnauthorized,
    ...SwagNotFound
  }
};

export const bulkPaths = {
  [`${routes.bulk}`]: {
    post: bulkCreation,
    patch: bulkUpdate
  }
};
