import { prisma } from "../../utils/constants";
import { marking, Prisma } from "@prisma/client";
import { isValidObject } from "../../utils/helper_functions";

/**
 * * Returns all existing markings from the database
 */
const getAllMarkings = async (): Promise<marking[]> => {
  return await prisma.marking.findMany();
};

/**
 * * Gets a marking by the marking_id
 * * Returns null if non-existent
 * @param {string} marking_id
 */
const getMarkingById = async (marking_id: string): Promise<marking | null> => {
  return await prisma.marking.findUnique({
    where: {
      marking_id: marking_id,
    },
  });
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
 * @param {Prisma.markingUncheckedCreateInput} marking_data
 */
const createMarking = async (
  marking_data: Prisma.markingUncheckedCreateInput
): Promise<marking> => {
  return await prisma.marking.create({ data: marking_data });
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

/**
 * * Ensures that a create marking input has the right fields
 * TODO: Finalize which fields should be allowed or required
 * @param {marking} data
 */
const isValidCreateMarkingInput = (
  data: Prisma.markingUncheckedCreateInput
): boolean => {
  const requiredFields: (keyof Prisma.markingUncheckedCreateInput)[] = [
    "critter_id",
    "taxon_marking_body_location_id",
  ];
  const allowedFields: (keyof Prisma.markingUncheckedCreateInput)[] = [
    ...requiredFields,
    "capture_id",
    "mortality_id",
    "marking_type_id",
    "marking_material_id",
    "primary_colour_id",
    "secondary_colour_id",
    "text_colour_id",
    "identifier",
    "frequency",
    "frequency_unit",
    "order",
    "comment",
    "attached_timestamp",
    "removed_timestamp",
    "create_user",
    "update_user",
  ];
  return isValidObject(data, requiredFields, allowedFields);
};

/**
 * * Ensures that a update marking input has the right fields
 * TODO: Finalize which fields should be allowed or required
 * @param {marking} data
 */
const isValidUpdateMarkingInput = (
  data: Prisma.markingUncheckedUpdateInput
): boolean => {
  const allowedFields: (keyof Prisma.markingUncheckedUpdateInput)[] = [
    "critter_id",
    "capture_id",
    "mortality_id",
    "taxon_marking_body_location_id",
    "marking_type_id",
    "marking_material_id",
    "primary_colour_id",
    "secondary_colour_id",
    "text_colour_id",
    "identifier",
    "frequency",
    "frequency_unit",
    "order",
    "comment",
    "attached_timestamp",
    "removed_timestamp",
    "update_user",
  ];
  return isValidObject(data, [], allowedFields);
};

export {
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
  createMarking,
  deleteMarking,
  isValidCreateMarkingInput,
  isValidUpdateMarkingInput,
};
