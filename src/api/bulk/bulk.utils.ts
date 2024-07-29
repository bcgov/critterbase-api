import { z } from 'zod';
import { BulkCaptureCreateSchema } from '../../schemas/capture-schema';
import { BulkCritterCreateSchema } from '../../schemas/critter-schema';
import { LocationBulkCreateSchema } from '../../schemas/location-schema';
import { MortalityCreateSchema } from '../../schemas/mortality-schema';
import { CollectionUnitCreateBodySchema } from '../collectionUnit/collectionUnit.utils';
import {
  FamilyChildCreateBodySchema,
  FamilyCreateBodySchema,
  FamilyParentCreateBodySchema
} from '../family/family.utils';
import { MarkingCreateBodySchema } from '../marking/marking.utils';
import { QualitativeCreateSchema, QuantitativeCreateSchema } from '../measurement/measurement.utils';

const OptionalRecordArraySchema = z.array(z.record(z.string(), z.unknown())).optional();

/**
 * Pre parse bulk create schema
 *
 */
const BulkShapeSchema = z.object({
  critters: OptionalRecordArraySchema,
  collections: OptionalRecordArraySchema,
  markings: OptionalRecordArraySchema,
  locations: OptionalRecordArraySchema,
  captures: OptionalRecordArraySchema,
  mortalities: OptionalRecordArraySchema,
  quantitative_measurements: OptionalRecordArraySchema,
  qualitative_measurements: OptionalRecordArraySchema,
  families: z
    .object({
      families: OptionalRecordArraySchema,
      parents: OptionalRecordArraySchema,
      children: OptionalRecordArraySchema
    })
    .optional()
});

/**
 * Bulk create schema - after parsed with BulkShapeSchema
 *
 */
const BulkCreationSchema = z.object({
  critters: z.array(BulkCritterCreateSchema).optional(),
  collections: z.array(CollectionUnitCreateBodySchema).optional(),
  markings: z.array(MarkingCreateBodySchema).optional(),
  locations: z.array(LocationBulkCreateSchema).optional(),
  captures: z.array(BulkCaptureCreateSchema).optional(),
  mortalities: z.array(MortalityCreateSchema).optional(),
  quantitative_measurements: z.array(QuantitativeCreateSchema).optional(),
  qualitative_measurements: z.array(QualitativeCreateSchema).optional(),
  families: z
    .object({
      families: z.array(FamilyCreateBodySchema).optional(),
      parents: z.array(FamilyParentCreateBodySchema).optional(),
      children: z.array(FamilyChildCreateBodySchema).optional()
    })
    .optional()
});

/**
 * Get records to update.
 *
 * Returns only objects without a _delete property or with a _delete property set to false.
 *
 * @template T
 * @param {((T & { _delete?: boolean }[]) | undefined)} arr
 * @return {*}
 */
const getBulkUpdates = <T>(arr: (T & { _delete?: boolean }[]) | undefined) => {
  return arr?.filter((val) => !val._delete);
};

/**
 * Get records to delete.
 *
 * Returns only objects with a _delete property set to true.
 *
 * @template T
 * @param {((T & { _delete?: boolean }[]) | undefined)} arr
 * @return {*}
 */
const getBulkDeletes = <T>(arr: (T & { _delete?: boolean }[]) | undefined) => {
  return arr?.filter((val) => val._delete);
};

export { BulkCreationSchema, BulkShapeSchema, getBulkDeletes, getBulkUpdates };
