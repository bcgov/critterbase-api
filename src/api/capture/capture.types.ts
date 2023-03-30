import { capture, Prisma } from "@prisma/client";
import {
  commonLocationSelect,
  FormattedLocation,
  LocationSubsetType,
} from "../location/location.utils";
import { z } from "zod";

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
type FormattedCapture = capture & {
  capture_location?: FormattedLocation;
  release_location?: FormattedLocation;
};

const CaptureUpdateBodySchema = z.object({
  critter_id: z.string().uuid().optional(),
  capture_location_id: z.string().uuid().optional(),
  release_location_id: z.string().uuid().optional().nullable(),
  capture_timestamp: z.coerce.date().optional(),
  release_timestamp: z.coerce.date().optional(),
  capture_comment: z.string().optional().nullable(),
  release_comment: z.string().optional().nullable(),
});

const CaptureCreateBodySchema = CaptureUpdateBodySchema.extend({
  capture_id: z.string().uuid().optional(),
  critter_id: z.string().uuid(),
  capture_timestamp: z.coerce.date(),
});

type CaptureCreate = z.infer<typeof CaptureCreateBodySchema>;
type CaptureUpdate = z.infer<typeof CaptureUpdateBodySchema>;

export type {
  CaptureIncludeType,
  FormattedCapture,
  CaptureCreate,
  CaptureUpdate,
};
export { captureInclude, CaptureCreateBodySchema, CaptureUpdateBodySchema };
