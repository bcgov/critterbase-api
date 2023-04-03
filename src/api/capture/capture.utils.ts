import { capture, Prisma } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  noAudit,
  ResponseSchema,
  zodID,
} from "../../utils/zod_helpers";
import {
  locationIncludes,
  LocationResponseSchema,
} from "../location/location.utils";
import { getCaptureById } from "./capture.service";

const captureInclude: Prisma.captureInclude = {
  location_capture_capture_location_idTolocation: { include: locationIncludes },
  location_capture_release_location_idTolocation: { include: locationIncludes },
};

// type CaptureIncludeType = Prisma.captureGetPayload<typeof captureInclude>;

const CaptureBodySchema = implement<capture>().with({
  capture_id: zodID,
  critter_id: zodID,
  capture_location_id: zodID.nullable(),
  release_location_id: zodID.nullable(),
  capture_timestamp: z.coerce.date(),
  release_timestamp: z.coerce.date().nullable(),
  capture_comment: z.string().nullable(),
  release_comment: z.string().nullable(),
  create_user: zodID,
  update_user: zodID,
  create_timestamp: z.coerce.date(),
  update_timestamp: z.coerce.date(),
});

const CaptureUpdateSchema = implement<
  Omit<
    Prisma.captureUncheckedUpdateManyInput,
    "capture_id" | keyof AuditColumns
  >
>().with(
  CaptureBodySchema.omit({
    capture_id: true,
    ...noAudit,
  }).partial().shape
);

const CaptureCreateSchema = implement<
  Omit<Prisma.captureCreateManyInput, "capture_id" | keyof AuditColumns>
>().with(
  CaptureUpdateSchema.required({
    critter_id: true,
    capture_timestamp: true,
  }).shape
);

const CaptureResponseSchema = ResponseSchema.transform((val) => {
  const {
    location_capture_capture_location_idTolocation: c_location,
    location_capture_release_location_idTolocation: r_location,
    ...rest
  } = val as Prisma.PromiseReturnType<typeof getCaptureById>;
  return {
    ...rest,
    capture_location: c_location
      ? LocationResponseSchema.parse(c_location)
      : null,
    release_location: r_location
      ? LocationResponseSchema.parse(r_location)
      : null,
  };
});

type CaptureCreate = z.infer<typeof CaptureCreateSchema>;
type CaptureUpdate = z.infer<typeof CaptureUpdateSchema>;
type FormattedCapture = z.infer<typeof CaptureResponseSchema>;

export type { FormattedCapture, CaptureCreate, CaptureUpdate };
export {
  captureInclude,
  CaptureCreateSchema,
  CaptureUpdateSchema,
  CaptureResponseSchema,
};
