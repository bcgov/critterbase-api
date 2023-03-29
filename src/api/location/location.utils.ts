import { coordinate_uncertainty_unit, location, Prisma } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  LookupRegionEnvSchema,
  LookupRegionNrSchema,
  LookupWmuSchema,
  noAudit,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";

// Zod Schemas
/**
 ** Base location schema
 * Note: implements the prisma type to stay in sync with DB.
 */
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
  ...zodAudit,
});

const LocationCreateSchema = implement<
  Omit<Prisma.locationCreateManyInput, "location_id" | keyof AuditColumns>
>()
  .with(LocationSchema.omit({ location_id: true, ...noAudit }).partial().shape)
  .strict();

const LocationResponseSchema = LocationSchema.omit({
  wmu_id: true,
  region_nr_id: true,
  region_env_id: true,
})
  .extend({
    lk_wildlife_management_unit: LookupWmuSchema.nullish(),
    lk_region_nr: LookupRegionNrSchema.nullish(),
    lk_region_env: LookupRegionEnvSchema.nullish(),
  })
  .transform((val) => {
    const {
      lk_wildlife_management_unit,
      lk_region_nr,
      lk_region_env,
      ...rest
    } = val;
    return {
      ...rest,
      wmu_name: lk_wildlife_management_unit?.wmu_name,
      region_nr_name: lk_region_nr?.region_nr_name,
      region_env_name: lk_region_env?.region_env_name,
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
