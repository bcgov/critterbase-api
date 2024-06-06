import { Prisma, capture, coordinate_uncertainty_unit } from '@prisma/client';
import { z } from 'zod';
import { LocationCreateSchema, LocationUpdateSchema } from '../api/location/location.utils';
import { AuditColumns } from '../utils/types';
import { DeleteSchema, implement, zodID } from '../utils/zod_helpers';

/**
 * @table Capture
 *
 * Base Capture schema, omitting audit columns.
 * Using 'implement' to keep zod schema in sync with prisma type.
 *
 */
export const CaptureSchema = implement<Capture>()
  .with({
    capture_id: zodID,
    critter_id: zodID,
    capture_method_id: zodID.nullable(),
    capture_location_id: zodID.nullable(),
    release_location_id: zodID.nullable(),
    capture_date: z.coerce.date(),
    capture_time: z.coerce.date().nullable(),
    release_date: z.coerce.date().nullable(),
    release_time: z.coerce.date().nullable(),
    capture_comment: z.string().nullable(),
    release_comment: z.string().nullable()
  })
  .strict();

/**
 * Detailed location schema, omitting audit columns.
 *
 */
export const DetailedLocationSchema = z
  .object({
    location_id: zodID,
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    coordinate_uncertainty: z.number().nullable(),
    coordinate_uncertainty_unit: z.nativeEnum(coordinate_uncertainty_unit).nullable(),
    region_env_id: zodID.nullable(),
    region_nr_id: zodID.nullable(),
    wmu_id: zodID.nullable(),
    //TODO: update mortality repo query
    //
    //region_env_name: z.string().nullable(),
    //region_nr_name: z.string().nullable(),
    //wmu_name: z.string().nullable(),
    elevation: z.number().nullable(),
    temperature: z.number().nullable(),
    location_comment: z.string().nullable()
  })
  .strict();

/**
 * Detailed capture schema with location details included.
 *
 */
export const DetailedCaptureSchema = CaptureSchema.omit({ capture_location_id: true, release_location_id: true })
  .extend({
    capture_location: DetailedLocationSchema.nullish(),
    release_location: DetailedLocationSchema.nullish()
  })
  .strict();

/**
 * Create capture schema.
 *
 * Note: excludes capture_location_id + release_location_id - should not be known on creation
 */
export const CaptureCreateSchema = z
  .object({
    capture_id: zodID.optional(),
    critter_id: zodID,
    capture_method_id: zodID.optional(),
    capture_location: LocationCreateSchema.optional(),
    release_location: LocationCreateSchema.optional(),
    capture_date: z.coerce.date(),
    capture_time: z.coerce.date().nullish(),
    release_date: z.coerce.date().nullish(),
    release_time: z.coerce.date().nullish(),
    capture_comment: z.string().nullish(),
    release_comment: z.string().nullish()
  })
  .strict();

/**
 * Update capture schema.
 *
 */
export const CaptureUpdateSchema = z
  .object({
    capture_id: zodID.optional(),
    critter_id: zodID.optional(),
    capture_method_id: zodID.nullish(),
    capture_location_id: zodID.optional(),
    release_location_id: zodID.optional(),
    capture_location: LocationUpdateSchema.optional(),
    release_location: LocationUpdateSchema.optional(),
    capture_date: z.coerce.date().optional(),
    capture_time: z.coerce.date().nullish(),
    release_date: z.coerce.date().nullish(),
    release_time: z.coerce.date().nullish(),
    capture_comment: z.string().nullish(),
    release_comment: z.string().nullish()
  })
  .strict();

/**
 * Schema for capture delete payloads, used mostly for bulk requests.
 *
 */
export const CaptureDeleteSchema = z.object({ capture_id: zodID }).extend(DeleteSchema.shape);

/**
 * Inferred types from zod schemas.
 *
 */
export type Capture = Omit<capture, AuditColumns>; // Omitting audit columns.
export type CaptureCreate = z.infer<typeof CaptureCreateSchema>;
export type CaptureUpdate = z.infer<typeof CaptureUpdateSchema>;
export type DetailedCapture = z.infer<typeof DetailedCaptureSchema>;

/**
 * Type wrapper for complex prisma location `where` type
 *
 */
export type PrismaCaptureLocationUpsert = Prisma.locationUpdateOneWithoutRelease_locationNestedInput | undefined;
