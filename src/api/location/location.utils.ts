import { coordinate_uncertainty_unit, location, Prisma } from '@prisma/client';
import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { AuditColumns } from '../../utils/types';
import { implement, noAudit, ResponseSchema, zodAudit, zodID } from '../../utils/zod_helpers';
import { getLocationOrThrow } from './location.service';
extendZodWithOpenApi(z);

/**
 * Base location schema
 * Note: implements the prisma type to stay in sync with DB.
 */
const LocationSchema = implement<location>()
  .with({
    location_id: zodID,
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    coordinate_uncertainty: z.number().nullable(),
    coordinate_uncertainty_unit: z.nativeEnum(coordinate_uncertainty_unit).nullable(),
    wmu_id: zodID.nullable(),
    region_nr_id: zodID.nullable(),
    region_env_id: zodID.nullable(),
    elevation: z.number().nullable(),
    temperature: z.number().nullable(),
    location_comment: z.string().nullable(),
    ...zodAudit
  })
  .openapi({ description: 'Responds with default location' });

const LocationCreateSchema = implement<Omit<Prisma.locationCreateManyInput, 'location_id' | AuditColumns>>()
  .with(
    LocationSchema.omit({ location_id: true, ...noAudit })
      .strict()
      .partial().shape
  )
  .openapi({ description: 'Responds with created location' });

const LocationUpdateSchema = implement<Omit<Prisma.locationUncheckedUpdateManyInput, AuditColumns>>()
  .with(LocationSchema.omit({ ...noAudit }).partial().shape)
  .openapi({ description: 'Responds with updated location' });

const LocationResponseSchema = ResponseSchema.transform((val) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wmu_id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    region_nr_id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    region_env_id,
    lk_wildlife_management_unit,
    lk_region_nr,
    lk_region_env,
    ...rest
  } = val as Prisma.PromiseReturnType<typeof getLocationOrThrow>;
  return {
    ...rest,
    wmu_name: lk_wildlife_management_unit?.wmu_name ?? null,
    region_nr_name: lk_region_nr?.region_nr_name ?? null,
    region_env_name: lk_region_env?.region_env_name ?? null
  };
}).openapi({ description: 'Responds with updated location' });

// Types
type LocationResponse = z.infer<typeof LocationResponseSchema>;

type LocationBody = z.infer<typeof LocationCreateSchema>;

const locationIncludes: Prisma.locationInclude = {
  lk_wildlife_management_unit: true,
  lk_region_nr: true,
  lk_region_env: true
};

export { LocationCreateSchema, locationIncludes, LocationResponseSchema, LocationSchema, LocationUpdateSchema };
export type { LocationBody, LocationResponse };
