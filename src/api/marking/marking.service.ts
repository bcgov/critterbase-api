import { z } from "zod";
import { prisma } from "../../utils/constants";
import {
  MarkingResponseSchema,
  MarkingCreateInput,
  MarkingIncludes,
  markingIncludes,
  markingResponseSchema,
  MarkingUpdateInput,
} from "./marking.types";

/**
 * * Returns all existing markings from the database
 */
const getAllMarkings = async (): Promise<MarkingResponseSchema[]> => {
  const markings: MarkingIncludes[] = await prisma.marking.findMany({
    ...markingIncludes,
  });
  return z.array(markingResponseSchema).parse(markings);
};

/**
 * * Gets a marking by the marking_id
 * * Returns null if non-existent
 * @param {string} marking_id
 */
const getMarkingById = async (
  marking_id: string
): Promise<MarkingResponseSchema> => {
  const marking: MarkingIncludes = await prisma.marking.findUniqueOrThrow({
    where: {
      marking_id: marking_id,
    },
    ...markingIncludes,
  });
  return markingResponseSchema.parse(marking);
};

/**
 * * Gets all markings that reference a critter_id
 * @param {string} marking_id
 */
const getMarkingsByCritterId = async (
  critter_id: string
): Promise<MarkingResponseSchema[]> => {
  const markings: MarkingIncludes[] = await prisma.marking.findMany({
    where: {
      critter_id: critter_id,
    },
    ...markingIncludes,
  });
  return z.array(markingResponseSchema).parse(markings);
};

/**
 * * Updates a marking in the database
 * @param {string} marking_id
 * @param {MarkingUpdateInput} marking_data
 */
const updateMarking = async (
  marking_id: string,
  marking_data: MarkingUpdateInput
): Promise<MarkingResponseSchema> => {
  const marking: MarkingIncludes = await prisma.marking.update({
    where: {
      marking_id: marking_id,
    },
    data: marking_data,
    ...markingIncludes,
  });
  return markingResponseSchema.parse(marking);
};

/**
 * * Creates a new marking in the database
 * * Valid reference to existing critter_id and taxon_marking_body_location_id UUIDs must be provided
 * @param {MarkingCreateInput} newMarkingData
 */
const createMarking = async (
  newMarkingData: MarkingCreateInput
): Promise<MarkingResponseSchema> => {
  const marking: MarkingIncludes = await prisma.marking.create({
    data: newMarkingData,
    ...markingIncludes,
  });
  return markingResponseSchema.parse(marking);
};

/**
 * * Removes a marking from the database
 * @param {string} marking_id
 */
const deleteMarking = async (
  marking_id: string
): Promise<MarkingResponseSchema> => {
  const marking: MarkingIncludes = await prisma.marking.delete({
    where: {
      marking_id: marking_id,
    },
    ...markingIncludes,
  });
  return markingResponseSchema.parse(marking);
};

export {
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
  createMarking,
  deleteMarking,
};
