import { capture, Prisma } from "@prisma/client";
import { CommonLocationSchema, commonLocationSelect, FormattedLocation, LocationSubsetType } from "../location/location.types";
import { z } from 'zod';
import { implement, noAudit, zodID } from "../../utils/zod_helpers";

const captureInclude = Prisma.validator<Prisma.captureArgs>()({
    include: {
      location_capture_capture_location_idTolocation: {
        ...commonLocationSelect
      },
      location_capture_release_location_idTolocation: {
        ...commonLocationSelect
      }
    }
  })
  
  type CaptureIncludeType = Prisma.captureGetPayload<typeof captureInclude>;

  const CaptureBodySchema = implement<capture>().with({
    capture_id: zodID,
    critter_id: zodID,
    capture_location_id: zodID.nullable(),
    release_location_id: zodID.nullable(),
    capture_timestamp: z.coerce.date(),
    release_timestamp: z.coerce.date().nullable(),
    capture_comment:z.string().nullable(),
    release_comment: z.string().nullable(),
    create_user: zodID,
    update_user: zodID,
    create_timestamp: z.coerce.date(),
    update_timestamp: z.coerce.date()
  });

  const CaptureCreateBodySchema = CaptureBodySchema.omit({
    capture_id: true,
    ...noAudit
  }).partial().required({
    critter_id: true,
    capture_timestamp: true,
  })

  type CaptureCreate = z.infer<typeof CaptureCreateBodySchema>

  const CaptureResponseSchema = implement<CaptureIncludeType>().with({
    capture_id: zodID,
    critter_id: zodID,
    capture_location_id: zodID.nullable(),
    release_location_id: zodID.nullable(),
    capture_timestamp: z.coerce.date(),
    release_timestamp: z.coerce.date().nullable(),
    capture_comment:z.string().nullable(),
    release_comment: z.string().nullable(),
    create_user: zodID,
    update_user: zodID,
    create_timestamp: z.coerce.date(),
    update_timestamp: z.coerce.date(),
    location_capture_capture_location_idTolocation: CommonLocationSchema.nullable(),
    location_capture_release_location_idTolocation: CommonLocationSchema.nullable()
  }).transform(val => {
    const {
      location_capture_capture_location_idTolocation,
      location_capture_release_location_idTolocation,
      ...rest
    } = val;
    return {...rest, capture_location: location_capture_capture_location_idTolocation, release_location: location_capture_release_location_idTolocation}
  });

  type FormattedCapture = z.infer<typeof CaptureResponseSchema>;


  export type {CaptureIncludeType, FormattedCapture, CaptureCreate}
  export {captureInclude, CaptureCreateBodySchema, CaptureResponseSchema}