import { capture, Prisma } from "@prisma/client";
import { CommonFormattedLocationSchema, CommonLocationSchema, commonLocationSelect, FormattedLocation, LocationSubsetType } from "../location/location.types";
import { z } from 'zod';
import { implement, noAudit, zodID } from "../../utils/zod_helpers";
import { AuditColumns } from "../../utils/types";

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

  const CaptureUpdateSchema = implement<
    Omit<Prisma.captureUncheckedUpdateManyInput, "capture_id" | keyof AuditColumns>>().with(CaptureBodySchema.omit({
      capture_id: true,
      ...noAudit
    }).partial().shape
    )

  const CaptureCreateSchema = implement<Omit<Prisma.captureCreateManyInput,  "capture_id" | keyof AuditColumns>>().with(
    CaptureUpdateSchema.required({
      critter_id: true,
      capture_timestamp: true
    }).shape
  )

  type CaptureCreate = z.infer<typeof CaptureCreateSchema>;
  type CaptureUpdate = z.infer<typeof CaptureUpdateSchema>;

  /*const CaptureResponseSchema = implement<CaptureIncludeType>().with({
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
  });*/
  
  //const CaptureResponseFormattedSchema = 
  const CaptureResponseSchema = z.object({}).passthrough()
  .transform((val) => {
    const {
      location_capture_capture_location_idTolocation,
      location_capture_release_location_idTolocation,
      ...rest
    } = val as CaptureIncludeType;
    return {
      ...rest, 
      capture_location: CommonFormattedLocationSchema.parse(location_capture_capture_location_idTolocation), 
      release_location: CommonFormattedLocationSchema.parse(location_capture_release_location_idTolocation)
    }
  });

  type FormattedCapture = z.infer<typeof CaptureResponseSchema>;


  export type {CaptureIncludeType, FormattedCapture, CaptureCreate, CaptureUpdate}
  export { captureInclude, CaptureCreateSchema, CaptureUpdateSchema, CaptureResponseSchema }