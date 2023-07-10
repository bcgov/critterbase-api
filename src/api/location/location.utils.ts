import { coordinate_uncertainty_unit, location, Prisma } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  noAudit,
  ResponseSchema,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";
import { getLocationOrThrow } from "./location.service";
import { extendZodWithOpenApi } from 'zod-openapi';
extendZodWithOpenApi(z);

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
>().with(
  LocationSchema.omit({ location_id: true, ...noAudit })
    .strict()
    .partial().shape
).openapi({description: 'Responds with created location'});

const LocationUpdateSchema = implement<
  Omit<Prisma.locationUncheckedUpdateManyInput, keyof AuditColumns>
>().with(LocationSchema.omit({ ...noAudit }).partial().shape).openapi({description: 'Responds with updated location'});

const LocationResponseSchema = ResponseSchema.transform((val) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wmu_id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    region_nr_id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    region_env_id,
    lk_wildlife_management_unit,
    lk_region_nr,
    lk_region_env,
    ...rest
  } = val as Prisma.PromiseReturnType<typeof getLocationOrThrow>;
  return {
    ...rest,
    wmu_name: lk_wildlife_management_unit?.wmu_name ?? null,
    region_nr_name: lk_region_nr?.region_nr_name ?? null,
    region_env_name: lk_region_env?.region_env_name ?? null,
  };
}).openapi({description: 'Responds with updated location'});

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
    coordinate_uncertainty: true,
    temperature: true,
    location_comment: true,
    lk_region_env: {
      select: {
        region_env_id: true,
        region_env_name: true,
      },
    },
    lk_region_nr: {
      select: {
        region_nr_id: true,
        region_nr_name: true,
      },
    },
    lk_wildlife_management_unit: {
      select: {
        wmu_id: true,
        wmu_name: true,
      },
    },
  },
});

type CommonLocationType = Prisma.locationGetPayload<
  typeof commonLocationSelect
>;

const CommonLocationSchema = implement<CommonLocationType>().with({
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  coordinate_uncertainty: z.number().nullable(),
  temperature: z.number().nullable(),
  location_comment: z.string().nullable(),
  lk_region_env: z
    .object({
      region_env_id: z.string(),
      region_env_name: z.string(),
    })
    .nullable(),
  lk_region_nr: z
    .object({
      region_nr_id: z.string(),
      region_nr_name: z.string(),
    })
    .nullable(),
  lk_wildlife_management_unit: z
    .object({
      wmu_id: z.string(),
      wmu_name: z.string(),
    })
    .nullable(),
}).openapi({description: 'Responds with default location'});

const CommonLocationValidation = CommonLocationSchema.omit({
  lk_region_env: true,
  lk_region_nr: true,
  lk_wildlife_management_unit: true,
}).extend({
  region_env_id: zodID.nullish(),
  region_nr_id: zodID.nullish(),
  wmu_id: zodID.nullish(),
  region_env_name: z.string().nullish(),
  region_nr_name: z.string().nullish(),
  wmu_name: z.string().nullish(),
});


const CommonFormattedLocationSchema = CommonLocationSchema.transform((val) => {
  const { lk_region_env, lk_region_nr, lk_wildlife_management_unit, ...rest } =
    val;
  return {
    ...rest,
    region_env_id: lk_region_env?.region_env_id,
    region_nr_id: lk_region_nr?.region_nr_id,
    wmu_id: lk_wildlife_management_unit?.wmu_id,
    region_env_name: lk_region_env?.region_env_name,
    region_nr_name: lk_region_nr?.region_nr_name,
    wmu_name: lk_wildlife_management_unit?.wmu_name,
  };
}).openapi({description: 'Responds with formatted location'});


const locationIncludes: Prisma.locationInclude = {
  lk_wildlife_management_unit: true,
  lk_region_nr: true,
  lk_region_env: true,
};

export type {
  LocationSubsetType,
  FormattedLocation,
  LocationResponse,
  LocationBody,
  CommonLocationType,
};
export {
  commonLocationSelect,
  CommonLocationSchema,
  LocationCreateSchema,
  locationIncludes,
  LocationResponseSchema,
  LocationSchema,
  LocationUpdateSchema,
  CommonFormattedLocationSchema,
  CommonLocationValidation,
};
