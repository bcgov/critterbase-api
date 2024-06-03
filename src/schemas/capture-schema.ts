import { capture } from '@prisma/client';
import { z } from 'zod';
import { LocationCreateSchema } from '../api/location/location.utils';
import { AuditColumns } from '../utils/types';
import { implement, zodID } from '../utils/zod_helpers';

/**
 * @table Capture
 *
 * Base Capture schema omitting audit columns.
 * Using 'implement' to keep zod schema in sync with prisma type.
 *
 */
export const CaptureSchema = implement<Capture>().with({
  capture_id: zodID,
  critter_id: zodID,
  capture_location_id: zodID.nullable(),
  release_location_id: zodID.nullable(),
  capture_timestamp: z.coerce.date(),
  release_timestamp: z.coerce.date().nullable(),
  capture_comment: z.string().nullable(),
  release_comment: z.string().nullable()
});

/**
 * Create capture schema
 *
 * Note: excludes capture_location_id + release_location_id - should not be known on creation
 */
export const CaptureCreateSchema = z.object({
  capture_id: zodID.optional(),
  critter_id: zodID,
  capture_location: LocationCreateSchema.optional(),
  release_location: LocationCreateSchema.optional(),
  capture_timestamp: z.coerce.date(),
  release_timestamp: z.coerce.date().nullable(),
  capture_comment: z.string().nullable(),
  release_comment: z.string().nullable()
});

/**
 * Inferred types from zod schemas.
 */
export type Capture = Omit<capture, AuditColumns>; // Omitting audit columns.
export type CaptureCreate = z.infer<typeof CaptureCreateSchema>;
