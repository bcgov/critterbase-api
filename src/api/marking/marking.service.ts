import { prisma } from "../../utils/constants";
import { marking, Prisma } from "@prisma/client";
import { exclude } from "../../utils/helper_functions";
import { markingExcludes, markingInclude } from "./marking.types";

/**
 * * Returns all existing markings from the database
 */
const getAllMarkings = async (): Promise<marking[]> => {
  return await prisma.marking.findMany();
};

/**
 * * Gets a marking by the marking_id
 * * Returns null if non-existent
 * TODO: Add type for marking with included subselects
 * @param {string} marking_id
 */
const getMarkingById = async (marking_id: string): Promise<any | null> => {
  const marking = await prisma.marking.findUnique({
    where: {
      marking_id: marking_id,
    },
    ...markingInclude,
  });
  return marking && exclude(marking, markingExcludes);
};

/**
 * * Gets all markings that reference a critter_id
 * @param {string} marking_id
 */
const getMarkingsByCritterId = async (
  critter_id: string
): Promise<marking[]> => {
  return await prisma.marking.findMany({
    where: {
      critter_id: critter_id,
    },
  });
};

/**
 * * Updates a marking in the database
 * @param {string} marking_id
 * @param {Prisma.markingUncheckedUpdateInput} marking_data
 */
const updateMarking = async (
  marking_id: string,
  marking_data: Prisma.markingUncheckedUpdateInput
): Promise<marking> => {
  return await prisma.marking.update({
    where: {
      marking_id: marking_id,
    },
    data: marking_data,
  });
};

/**
 * * Creates a new marking in the database
 * * Valid reference to existing critter_id and taxon_marking_body_location_id UUIDs must be provided
 * @param {Prisma.markingUncheckedCreateInput} newMarkingData
 */
const createMarking = async (
  newMarkingData: Prisma.markingUncheckedCreateInput
): Promise<marking> => {
  return await prisma.marking.create({ data: newMarkingData });
};

/**
 * * Removes a marking from the database
 * @param {string} marking_id
 */
const deleteMarking = async (marking_id: string): Promise<marking> => {
  return await prisma.marking.delete({
    where: {
      marking_id: marking_id,
    },
  });
};

export {
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
  createMarking,
  deleteMarking,
};
