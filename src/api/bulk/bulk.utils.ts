import { z } from 'zod';
import { ResponseSchema } from '../../utils/zod_helpers';

const BulkCreationSchema = z.object({
  critters: z.array(ResponseSchema).optional(),
  collections: z.array(ResponseSchema).optional(),
  markings: z.array(ResponseSchema).optional(),
  locations: z.array(ResponseSchema).optional(),
  captures: z.array(ResponseSchema).optional(),
  mortalities: z.array(ResponseSchema).optional(),
  quantitative_measurements: z.array(ResponseSchema).optional(),
  qualitative_measurements: z.array(ResponseSchema).optional(),
  families: z
    .object({
      families: z.array(ResponseSchema).optional(),
      parents: z.array(ResponseSchema).optional(),
      children: z.array(ResponseSchema).optional()
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

export { BulkCreationSchema, getBulkDeletes, getBulkUpdates };
