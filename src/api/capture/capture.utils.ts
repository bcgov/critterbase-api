import { capture, Prisma } from "@prisma/client";
import {
  CommonFormattedLocationSchema,
  commonLocationSelect,
  CommonLocationValidation,
  LocationBody,
  LocationCreateSchema,
  LocationUpdateSchema,
} from "../location/location.utils";
import { z } from "zod";
import {
  implement,
  noAudit,
  zodID,
} from "../../utils/zod_helpers";
import { AuditColumns } from "../../utils/types";
import { CommonLocationSchema } from "../location/location.utils";

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

const captureInclude = Prisma.validator<Prisma.captureArgs>()({
  include: {
    location_capture_capture_location_idTolocation: {
      ...commonLocationSelect,
    },
    location_capture_release_location_idTolocation: {
      ...commonLocationSelect,
    },
  },
});

type CaptureIncludeType = Prisma.captureGetPayload<typeof captureInclude>;

const CaptureIncludeSchema = implement<CaptureIncludeType>().with({
  ...CaptureBodySchema.shape,
  location_capture_capture_location_idTolocation:
    CommonLocationSchema.nullable(),
  location_capture_release_location_idTolocation:
    CommonLocationSchema.nullable(),
});

const CaptureUpdateSchema = implement<
  Omit<Prisma.captureUncheckedUpdateManyInput, keyof AuditColumns> & {
    capture_location?: LocationBody;
    release_location?: LocationBody;
    force_create_release?: boolean;
  }
>().with(
  CaptureBodySchema.omit({
    ...noAudit,
  })
    .extend({
      capture_location: LocationUpdateSchema,
      release_location: LocationUpdateSchema,
      force_create_release: z.boolean().optional(),
    })
    .partial().shape
);

const CaptureCreateSchema = implement<
  Omit<Prisma.captureCreateManyInput, keyof AuditColumns> & {
    capture_location?: LocationBody;
    release_location?: LocationBody;
    // capture_mortality?: boolean;
    // release_mortality?: boolean;
  }
>().with(
  CaptureBodySchema.omit({ ...noAudit })
    .extend({
      capture_location: LocationCreateSchema,
      release_location: LocationCreateSchema,
      // capture_mortality: z.boolean().optional(),
      // release_mortality: z.boolean().optional(),
    })
    .partial()
    .required({
      critter_id: true,
      capture_timestamp: true,
    }).shape
);

const CaptureValidation = CaptureIncludeSchema.omit({
  location_capture_capture_location_idTolocation: true,
  location_capture_release_location_idTolocation: true,
}).extend({
  capture_location: CommonLocationValidation.nullable(),
  release_location: CommonLocationValidation.nullable(),
});

type CaptureCreate = z.infer<typeof CaptureCreateSchema>;
type CaptureUpdate = z.infer<typeof CaptureUpdateSchema>;

const CaptureResponseSchema = CaptureIncludeSchema.transform((val) => {
  const {
    location_capture_capture_location_idTolocation: c_location,
    location_capture_release_location_idTolocation: r_location,
    ...rest
  } = val as CaptureIncludeType;
  return {
    ...rest,
    capture_location: c_location
      ? CommonFormattedLocationSchema.parse(c_location)
      : null,
    release_location: r_location
      ? CommonFormattedLocationSchema.parse(r_location)
      : null,
  };
}).pipe(CaptureValidation);

type FormattedCapture = z.infer<typeof CaptureResponseSchema>;

export type {
  CaptureIncludeType,
  FormattedCapture,
  CaptureCreate,
  CaptureUpdate,
};
export {
  captureInclude,
  CaptureCreateSchema,
  CaptureUpdateSchema,
  CaptureResponseSchema,
  CaptureBodySchema,
  CaptureIncludeSchema,
  CaptureValidation,
};
