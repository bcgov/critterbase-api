import { prisma } from "../../utils/constants";
import { marking, Prisma } from "@prisma/client";
import { exclude } from "../../utils/helper_functions";
import {
  MarkingCreateInput,
  markingExcludes,
  MarkingIncludes,
  markingIncludes,
  MarkingResponseBody,
  MarkingUpdateInput,
} from "./marking.types";

const formatMarking = (marking: MarkingIncludes) => {
  let obj;
};

/**
 * * Returns all existing markings from the database
 */
const getAllMarkings = async (): Promise<MarkingResponseBody[]> => {
  const markings = await prisma.marking.findMany({
    ...markingIncludes,
  });
  return markings.map((m) => exclude(m, markingExcludes));
};

/**
 * * Gets a marking by the marking_id
 * * Returns null if non-existent
 * @param {string} marking_id
 */
const getMarkingById = async (
  marking_id: string
): Promise<MarkingResponseBody> => {
  const marking = await prisma.marking.findUnique({
    where: {
      marking_id: marking_id,
    },
    ...markingIncludes,
  });
  return marking && exclude(marking, markingExcludes);
};

/**
 * * Gets all markings that reference a critter_id
 * @param {string} marking_id
 */
const getMarkingsByCritterId = async (
  critter_id: string
): Promise<MarkingResponseBody[]> => {
  const markings = await prisma.marking.findMany({
    where: {
      critter_id: critter_id,
    },
    ...markingIncludes,
  });
  return markings.map((m) => exclude(m, markingExcludes));
};

/**
 * * Updates a marking in the database
 * @param {string} marking_id
 * @param {MarkingUpdateInput} marking_data
 */
const updateMarking = async (
  marking_id: string,
  marking_data: MarkingUpdateInput
): Promise<MarkingResponseBody> => {
  const marking = await prisma.marking.update({
    where: {
      marking_id: marking_id,
    },
    data: marking_data,
    ...markingIncludes,
  });
  return marking && exclude(marking, markingExcludes);
};

/**
 * * Creates a new marking in the database
 * * Valid reference to existing critter_id and taxon_marking_body_location_id UUIDs must be provided
 * @param {MarkingCreateInput} newMarkingData
 */
const createMarking = async (
  newMarkingData: MarkingCreateInput
): Promise<MarkingResponseBody> => {
  const marking = await prisma.marking.create({
    data: newMarkingData,
    ...markingIncludes,
  });
  return marking && exclude(marking, markingExcludes);
};

/**
 * * Removes a marking from the database
 * @param {string} marking_id
 */
const deleteMarking = async (
  marking_id: string
): Promise<MarkingResponseBody> => {
  const marking = await prisma.marking.delete({
    where: {
      marking_id: marking_id,
    },
    ...markingIncludes,
  });
  return marking && exclude(marking, markingExcludes);
};

export {
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
  createMarking,
  deleteMarking,
};
