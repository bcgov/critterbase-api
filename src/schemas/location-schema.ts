import { coordinate_uncertainty_unit, location } from '@prisma/client';
import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { AuditColumns } from '../utils/types';
import { implement, zodID } from '../utils/zod_helpers';

extendZodWithOpenApi(z);

/**
 * @table location
 *
 * Base Location schema omitting audit columns.
 * Using 'implement' to keep zod schema in sync with prisma type.
 *
 */
export const LocationSchema = implement<Location>()
  .with({
    location_id: zodID,
    latitude: z.number().min(-90).max(90).nullable(),
    longitude: z.number().min(-180).max(180).nullable(),
    coordinate_uncertainty: z.number().nullable(),
    coordinate_uncertainty_unit: z.nativeEnum(coordinate_uncertainty_unit).nullable(),
    wmu_id: zodID.nullable(),
    region_nr_id: zodID.nullable(),
    region_env_id: zodID.nullable(),
    elevation: z.number().nullable(),
    temperature: z.number().nullable(),
    location_comment: z.string().nullable()
  })
  .openapi({ description: 'Responds with default location' });

/**
 * Create location schema
 *
 */
export const LocationCreateSchema = implement<Partial<Omit<Location, 'location_id'>>>()
  .with(LocationSchema.omit({ location_id: true }).strict().partial().shape)
  .openapi({ description: 'Responds with created location' });

/**
 * Create bulk location schema
 *
 */
export const LocationBulkCreateSchema = LocationSchema.partial().openapi({
  description: 'Responds with created location'
});

/**
 * Update location schema
 *
 */
export const LocationUpdateSchema = implement<Partial<Location>>()
  .with(LocationSchema.strict().partial().shape)
  .openapi({ description: 'Responds with updated location' });

/**
 * Inferred types
 *
 */
type Location = Omit<location, AuditColumns>;
export type LocationCreate = z.infer<typeof LocationCreateSchema>;
export type LocationUpdate = z.infer<typeof LocationUpdateSchema>;
