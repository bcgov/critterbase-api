import { capture, Prisma } from "@prisma/client";
import { CommonFormattedLocationSchema, commonLocationSelect } from "../location/location.utils";
import { z } from 'zod';
import { implement, noAudit, ResponseSchema, zodID } from "../../utils/zod_helpers";
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

  const CaptureResponseSchema = ResponseSchema
  .transform((val) => {
    const {
      location_capture_capture_location_idTolocation: c_location,
      location_capture_release_location_idTolocation: r_location,
      ...rest
    } = val as CaptureIncludeType;
    return {
      ...rest, 
      capture_location: c_location ? CommonFormattedLocationSchema.parse(c_location) : null, 
      release_location: r_location ? CommonFormattedLocationSchema.parse(r_location) : null
    }
  });

  type FormattedCapture = z.infer<typeof CaptureResponseSchema>;


  export type {CaptureIncludeType, FormattedCapture, CaptureCreate, CaptureUpdate}
  export { captureInclude, CaptureCreateSchema, CaptureUpdateSchema, CaptureResponseSchema }