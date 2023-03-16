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
// location_id: string
// latitude: number | null
// longitude: number | null
// coordinate_uncertainty: number | null
// coordinate_uncertainty_unit: coordinate_uncertainty_unit | null
// wmu_id: string | null
// region_nr_id: string | null
// region_env_id: string | null
// elevation: number | null
// temperature: number | null
// location_comment: string | null
// create_user: string
// update_user: string
// create_timestamp: Date
// update_timestamp: Date
const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(-180).nullable(),
  coordinate_uncertainty: z.number().nullable(),
  wmu_id: z.string().uuid().nullable(),
  region_nr_id: z.string().uuid().nullable(),
  region_env_id: z.string().uuid().nullable(),
  elevation: z.number().min(0).nullable(),
  temperature: z.number().min(-100).max(100).nullable(),
  location_comment: z.string().max(100).nullable(),
  //then placeholder for audit
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

const createLocation = async (body: location): Promise<location> => {
  return await prisma.location.create({
    data: {
      ...body,
    },
  });
};
export {
  LocationSchema,
  getAllLocations,
  getLocation,
  deleteLocation,
  createLocation,
};
