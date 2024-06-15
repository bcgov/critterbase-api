import { Prisma, capture } from '@prisma/client';
import { z } from 'zod';
import { AuditColumns } from '../utils/types';
import { DeleteSchema, implement, zodID, zodTime } from '../utils/zod_helpers';
import { LocationCreateSchema, LocationSchema, LocationUpdateSchema } from './location-schema';

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
    capture_date: z.string(),
    capture_time: z.string().nullable(),
    release_date: z.string().nullable(),
    release_time: z.string().nullable(),
    capture_comment: z.string().nullable(),
    release_comment: z.string().nullable()
  })
  .strict();

/**
 * Detailed capture schema with location details included.
 *
 */
export const DetailedCaptureSchema = CaptureSchema.omit({ capture_location_id: true, release_location_id: true })
  .extend({
    capture_location: LocationSchema.nullish(),
    release_location: LocationSchema.nullish()
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
    capture_method_id: zodID.nullish(),
    capture_location: LocationCreateSchema.optional(),
    release_location: LocationCreateSchema.optional(),
    capture_date: z.coerce.date(),
    capture_time: zodTime.nullish(),
    release_date: z.coerce.date().nullish(),
    release_time: zodTime.nullish(),
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
    capture_time: zodTime.nullish(),
    release_date: z.coerce.date().nullish(),
    release_time: zodTime.nullish(),
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
 * Extended Capture type
 *
 * @see extended-prisma-client.ts
 *
 * Note: Capture ORM is extended to format date / time columns.
 * Prisma is expecting dates to be passed on update / creates but returns formatted strings.
 *
 */
type CaptureExtended = Omit<capture, 'capture_date' | 'capture_time' | 'release_date' | 'release_time'> & {
  capture_date: string;
  capture_time: string | null;
  release_date: string | null;
  release_time: string | null;
};

/**
 * Type wrapper for complex prisma location `where` type
 *
 */
export type PrismaCaptureLocationUpsert = Prisma.locationUpdateOneWithoutRelease_locationNestedInput | undefined;

/**
 * Inferred types from zod schemas.
 *
 */
export type Capture = Omit<CaptureExtended, AuditColumns>; // Omitting audit columns.
export type CaptureCreate = z.infer<typeof CaptureCreateSchema>;
export type CaptureUpdate = z.infer<typeof CaptureUpdateSchema>;
export type DetailedCapture = z.infer<typeof DetailedCaptureSchema>;
