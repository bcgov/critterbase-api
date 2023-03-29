import { coordinate_uncertainty_unit, location, Prisma } from "@prisma/client";
import { z } from "zod";
import {
  implement,
  LookupRegionEnvSchema,
  LookupRegionNrSchema,
  LookupWmuSchema,
  noAudit,
  zodID,
} from "../../utils/zod_helpers";

// Zod Schemas
const LocationSchema = implement<location>().with({
  location_id: zodID,
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  coordinate_uncertainty: z.number().nullable(),
  coordinate_uncertainty_unit: z
    .nativeEnum(coordinate_uncertainty_unit)
    .nullable(),
  wmu_id: zodID.nullable(),
  region_nr_id: zodID.nullable(),
  region_env_id: zodID.nullable(),
  elevation: z.number().nullable(),
  temperature: z.number().nullable(),
  location_comment: z.string().nullable(),
  create_user: zodID,
  update_user: zodID,
  create_timestamp: z.date(),
  update_timestamp: z.date(),
});

const LocationCreateSchema = LocationSchema.omit({
  location_id: true,
  ...noAudit,
})
  .partial()
  .strict();

const LocationResponseSchema = LocationSchema.extend({
  lk_wildlife_management_unit: LookupWmuSchema.nullish(),
  lk_region_nr: LookupRegionNrSchema.nullish(),
  lk_region_env: LookupRegionEnvSchema.nullish(),
}).transform((val) => {
  const {
    lk_wildlife_management_unit,
    lk_region_nr,
    lk_region_env,
    wmu_id,
    region_nr_id,
    region_env_id,
    ...rest
  } = val;
  return {
    ...rest,
    wmu_name: lk_wildlife_management_unit?.wmu_name,
    lk_region_nr: lk_region_nr?.region_nr_name,
    lk_region_env: lk_region_env?.region_env_name,
  };
});

// Types
type LocationResponse = z.infer<typeof LocationResponseSchema>;

type LocationSubsetType = Prisma.locationGetPayload<
  typeof commonLocationSelect
>;

type FormattedLocation = Omit<
  LocationSubsetType,
  "lk_region_env" | "lk_region_nr" | "lk_wildlife_management_unit"
> & {
  region_env_name: string;
  lk_region_nr: string;
  lk_wildlife_management_unit: string;
};
//type FormattedLocation = Prisma.PromiseReturnType<typeof getLocationOrThrow>;

type LocationBody = z.infer<typeof LocationCreateSchema>;

const commonLocationSelect = Prisma.validator<Prisma.locationArgs>()({
  select: {
    latitude: true,
    longitude: true,
    lk_region_env: {
      select: {
        region_env_name: true,
      },
    },
    lk_region_nr: {
      select: {
        region_nr_name: true,
      },
    },
    lk_wildlife_management_unit: {
      select: {
        wmu_name: true,
      },
    },
  },
});

const locationIncludes: Prisma.locationInclude = {
  lk_wildlife_management_unit: true,
  lk_region_nr: true,
  lk_region_env: true,
};

export type { LocationSubsetType, FormattedLocation, LocationResponse };
export {
  commonLocationSelect,
  LocationBody,
  LocationCreateSchema,
  locationIncludes,
  LocationResponseSchema,
  LocationSchema,
};
