import { capture } from '@prisma/client';
import { z } from 'zod';
import { LocationCreateSchema } from '../api/location/location.utils';
import { AuditColumns } from '../utils/types';
import { implement, zodID } from '../utils/zod_helpers';
import { DetailedCritterLocationSchema } from './critter-schema';

/**
 * @table Capture
 *
 * Base Capture schema omitting audit columns.
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
 * Detailed capture schema with location details included.
 *
 */
export const DetailedCaptureSchema = CaptureSchema.extend({
  capture_location: DetailedCritterLocationSchema.optional(),
  release_location: DetailedCritterLocationSchema.optional()
}).strict();

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
    critter_id: zodID,
    capture_method: zodID.nullable(),
    capture_location_id: zodID.nullable(),
    release_location_id: zodID.nullable(),
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
 * Inferred types from zod schemas.
 *
 */
export type Capture = Omit<capture, AuditColumns>; // Omitting audit columns.
export type CaptureCreate = z.infer<typeof CaptureCreateSchema>;
export type CaptureUpdate = z.infer<typeof CaptureUpdateSchema>;
export type DetailedCapture = z.infer<typeof DetailedCaptureSchema>;
