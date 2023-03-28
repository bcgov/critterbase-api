import {
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
  location,
  Prisma,
  capture,
} from "@prisma/client";

import { z } from "zod";
import { prisma } from "../../utils/constants";
import { exclude } from "../../utils/helper_functions";
import { CaptureIncludeType } from "../capture/capture.types";
import { CaptureSubsetType } from "../critter/critter.types";
import {
  FormattedLocation,
  locationExcludeKeys,
  LocationResponseSchema,
  locationIncludes,
  LocationSubsetType,
} from "./location.types";

const formatLocation = (location: LocationSubsetType) => {
  return exclude(location, [
    "lk_region_env",
    "lk_region_nr",
    "lk_wildlife_management_unit",
  ]) as FormattedLocation;
};

/**
 ** gets a single location by id
 * @param id string -> critter_id
 * @returns {Promise<FormattedLocation>}
 * Note: inferring return type
 */
const getLocationOrThrow = async (id: string) => {
  const location = await prisma.location.findUniqueOrThrow({
    where: {
      location_id: id,
    },
    include: locationIncludes,
  });
  return LocationResponseSchema.parse(location);
  //return exclude(location, locationExcludeKeys) as R;
};
/**
 ** gets all locations
 * @returns {Promise<FormattedLocation[]>}
 * Note: inferring return type
 */
const getAllLocations = async (): Promise<FormattedLocation[]> => {
  const locations = await prisma.location.findMany({
    include: locationIncludes,
  });
  const res =  locations.map((l) => LocationResponseSchema.parse(l));
  return res;
};

/**
 ** deletes a location by id
 * @param id string -> critter_id
 * @returns {Promise<location>}
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
 * @returns {Promise<location>}
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
  getAllLocations,
  getLocationOrThrow,
  deleteLocation,
  createLocation,
  updateLocation,
  formatLocation,
};
