import {
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
  location,
} from "@prisma/client";

import { z } from "zod";
import { prisma } from "../../utils/constants";
import { exclude } from "../../utils/helper_functions";

type LocationExcludes =
  | keyof location
  | "lk_region_env"
  | "lk_region_nr"
  | "lk_wildlife_management_unit";

const excludes: LocationExcludes[] = [
  "wmu_id",
  "region_nr_id",
  "region_env_id",
  "lk_wildlife_management_unit",
  "lk_region_nr",
  "lk_region_env",
];

const LocationCreateBodySchema = z.object({
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  coordinate_uncertainty: z.number().nullable(),
  coordinate_uncertainty_unit: z.enum(["m"]).default("m"),
  wmu_id: z.string().uuid().nullable(),
  region_nr_id: z.string().uuid().nullable(),
  region_env_id: z.string().uuid().nullable(),
  elevation: z.number().min(0).nullable(),
  temperature: z.number().min(-100).max(100).nullable(),
  location_comment: z.string().max(100).nullable(),
});

const LocationUpdateBodySchema = LocationCreateBodySchema.extend({
  location_id: z.string().uuid(),
});

const subSelects = {
  include: {
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
  },
};

const getLocation = async (id: string) => {
  const location = await prisma.location.findUnique({
    where: {
      location_id: id,
    },
    ...subSelects,
  });
  return location && exclude(location, excludes);
};

const getAllLocations = async () => {
  const locations = await prisma.location.findMany({ ...subSelects });
  return locations?.length && locations.map((l) => exclude(l, excludes));
};

const deleteLocation = async (id: string): Promise<location> => {
  return await prisma.location.delete({
    where: {
      location_id: id,
    },
  });
};

const createLocation = async (data: location): Promise<location> => {
  return await prisma.location.create({ data });
};

const updateLocation = async (data: location): Promise<location> => {
  return await prisma.location.create({ data });
};
export {
  LocationCreateBodySchema,
  LocationUpdateBodySchema,
  getAllLocations,
  getLocation,
  deleteLocation,
  createLocation,
  updateLocation,
};
