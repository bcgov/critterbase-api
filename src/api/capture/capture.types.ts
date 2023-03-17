import { capture, Prisma } from "@prisma/client";
import { commonLocationSelect, FormattedLocation, LocationSubsetType } from "../location/location.types";

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
  type FormattedCapture = capture & {
    capture_location?: FormattedLocation,
    release_location?: FormattedLocation
  }

  export type {CaptureIncludeType, FormattedCapture}
  export {captureInclude}