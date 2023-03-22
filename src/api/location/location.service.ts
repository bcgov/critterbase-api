import {
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
  location,
  Prisma,
} from "@prisma/client";

import { z } from "zod";
import { prisma } from "../../utils/constants";
import { exclude } from "../../utils/helper_functions";
import {
  FormattedLocation,
  LocationBody,
  LocationBodySchema,
  LocationExcludes,
} from "./location.types";

const excludes: LocationExcludes[] = [
  "wmu_id",
  "region_nr_id",
  "region_env_id",
  "lk_wildlife_management_unit",
  "lk_region_nr",
  "lk_region_env",
];

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
 * @param id string -> critter_id
 * @returns {location}
 */
const getLocation = async (id: string): Promise<FormattedLocation> => {
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
 * @returns {locations}
 */
const getAllLocations = async (): Promise<FormattedLocation[]> => {
  const locations = await prisma.location.findMany({ ...subSelects });
  return locations.map((l) => exclude(l, excludes));
};

/**
 ** deletes a location by id
 * @param id string -> critter_id
 * @returns {location}
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
 * @param data LocationBody
 * @returns {location}
 */
const createLocation = async (data: LocationBody): Promise<location> => {
  return await prisma.location.create({ data });
};

/**
 ** updates existing location by id
 * @param data LocationBody
 * @param id string -> critter_id
 * @returns {Promise<Location>}
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
