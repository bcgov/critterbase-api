import { location } from '@prisma/client';

import { prisma } from '../../utils/constants';
import { LocationBody, locationIncludes } from './location.utils';

/**
 ** gets a single location by id
 * @param id string -> critter_id
 * @returns {Promise<location>}
 * Note: inferring return type
 */
const getLocationOrThrow = async (id: string) => {
  const location = await prisma.location.findUniqueOrThrow({
    where: {
      location_id: id
    },
    include: locationIncludes
  });
  return location;
};
/**
 ** gets all locations
 * @returns {Promise<location[]>}
 * Note: inferring return type
 */
const getAllLocations = async (): Promise<location[]> => {
  const locations = await prisma.location.findMany({
    include: locationIncludes
  });
  return locations;
};

/**
 ** deletes a location by id
 * @param id string -> critter_id
 * @returns {Promise<location>}
 */
const deleteLocation = async (id: string): Promise<location> => {
  return await prisma.location.delete({
    where: {
      location_id: id
    }
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
const updateLocation = async (data: LocationBody, id: string): Promise<location> => {
  return await prisma.location.update({
    where: {
      location_id: id
    },
    data
  });
};

export { getAllLocations, getLocationOrThrow, deleteLocation, createLocation, updateLocation };
