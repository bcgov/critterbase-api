import { coordinate_uncertainty_unit, location, Prisma } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import { implement, noAudit, zodID } from "../../utils/zod_helpers";

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
}).partial();

const LocationResponseSchema = LocationSchema.extend({
  wmu_name: z.string().nullish(),
  region_env_name: z.string().nullish(),
  region_nr_name: z.string().nullish(),
  lk_wildlife_management_unit: z.any(),
  lk_region_nr: z.any(),
  lk_region_env: z.any(),
})
  .omit({
    wmu_id: true,
    region_nr_id: true,
    region_env_id: true,
  })
  .transform((val) => val);

// Types
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

type LocationExclude = (keyof location | keyof Prisma.locationInclude)[];

// Constants
const locationExcludeKeys: LocationExclude = [
  "wmu_id",
  "region_nr_id",
  "region_env_id",
  "lk_wildlife_management_unit",
  "lk_region_nr",
  "lk_region_env",
];

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

type CommonLocationType = Prisma.locationGetPayload<typeof commonLocationSelect>

const CommonLocationSchema = implement<CommonLocationType>().with({
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  lk_region_env: z.object({
    region_env_name: z.string()
  }).nullable(),
  lk_region_nr: z.object({
    region_nr_name: z.string()
  }).nullable(),
  lk_wildlife_management_unit: z.object({
    wmu_name: z.string()
  }).nullable()
})

const locationIncludes: Prisma.locationInclude = {
  lk_wildlife_management_unit: {
    select: {
      wmu_name: true,
    },
  },
  lk_region_nr: {
    select: {
      region_nr_name: true,
    },
  },
  lk_region_env: {
    select: {
      region_env_name: true,
    },
  },
};

export type { LocationSubsetType, FormattedLocation};
export {
  commonLocationSelect,
  CommonLocationSchema,
  LocationCreateSchema,
  locationIncludes,
  locationExcludeKeys,
  LocationResponseSchema,
  LocationSchema,
};
