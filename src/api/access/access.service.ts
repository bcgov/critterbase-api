import { Prisma } from '@prisma/client';
import { prisma } from '../../utils/constants';

/**
 * Get database table data types.
 *
 * @async
 * @param {Prisma.ModelName} model - Database table name
 * @returns {*}
 */
export const getTableDataTypes = async (model: Prisma.ModelName) => {
  const results = await prisma.$queryRaw`
      WITH enums AS (
        SELECT typname, array_agg(e.enumlabel) AS enum_vals
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        GROUP BY typname)
      SELECT column_name, udt_name, enum_vals FROM information_schema.columns info
      LEFT JOIN enums ON info.column_name = enums.typname
      WHERE table_name = ${model}`;
  return results;
};
