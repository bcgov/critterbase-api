import {
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
  location,
} from "@prisma/client";

import { z } from "zod";
import { prisma } from "../../utils/constants";
import { exclude } from "../../utils/helper_functions";

// Types
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

type LocationBody = z.infer<typeof LocationBodySchema>;

// Zod Schemas
const LocationBodySchema = z.object({
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  coordinate_uncertainty: z.number().nullable().optional(),
  coordinate_uncertainty_unit: z.enum(["m"]).default("m").nullable().optional(),
  wmu_id: z.string().uuid().nullable().optional(),
  region_nr_id: z.string().uuid().nullable().optional(),
  region_env_id: z.string().uuid().nullable().optional(),
  elevation: z.number().min(0).nullable().optional(),
  temperature: z.number().min(-100).max(100).nullable().optional(),
  location_comment: z.string().max(100).nullable().optional(),
});

// Prisma objects
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
/**
 ** gets a single location by id
 * @param id critter_id
 * returns location
 */
const getLocation = async (id: string) => {
  const location = await prisma.location.findUnique({
    where: {
      location_id: id,
    },
    ...subSelects,
  });
  return exclude(location, excludes);
};
/**
 ** gets all locations
 * returns list of locations or null
 */
const getAllLocations = async () => {
  const locations = await prisma.location.findMany({ ...subSelects });
  return locations.map((l) => exclude(l, excludes));
};

/**
 ** deletes a location by id
 * @param id critter_id
 * returns location
 */
const deleteLocation = async (id: string): Promise<location> => {
  return await prisma.location.delete({
    where: {
      location_id: id,
    },
  });
};

/**
 ** creates new location
 * @param data Validated LocationBody
 * returns location
 */
const createLocation = async (data: LocationBody): Promise<location> => {
  return await prisma.location.create({ data });
};

/**
 ** updates existing location by id
 * @data validated LocationBody
 * @param id critter_id
 * returns location
 */
const updateLocation = async (
  data: LocationBody,
  id: string
): Promise<location> => {
  return await prisma.location.update({
    where: {
      location_id: id,
    },
    data,
  });
};
export {
  LocationBodySchema,
  getAllLocations,
  getLocation,
  deleteLocation,
  createLocation,
  updateLocation,
};
