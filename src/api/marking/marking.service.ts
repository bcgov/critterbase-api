import { prisma } from "../../utils/constants";
import { PrismaTransactionClient, ReqBody } from "../../utils/types";
import {
  getBodyLocationByNameAndTsn,
  getColourByName,
  getMarkingTypeByName,
} from "../lookup/lookup.service";
import {
  MarkingCreateInput,
  MarkingIncludes,
  MarkingUpdateInput,
  markingIncludes,
} from "./marking.utils";

/**
 * * Returns all existing markings from the database
 */
const getAllMarkings = async (): Promise<MarkingIncludes[]> => {
  const markings: MarkingIncludes[] = await prisma.marking.findMany({
    ...markingIncludes,
  });
  return markings;
};

/**
 * * Gets a marking by the marking_id
 * * Returns null if non-existent
 * @param {string} marking_id
 */
const getMarkingById = async (marking_id: string): Promise<MarkingIncludes> => {
  const marking: MarkingIncludes = await prisma.marking.findUniqueOrThrow({
    where: {
      marking_id: marking_id,
    },
    ...markingIncludes,
  });
  return marking;
};

/**
 * * Gets all markings that reference a critter_id
 * @param {string} critter_id
 */
const getMarkingsByCritterId = async (
  critter_id: string
): Promise<MarkingIncludes[]> => {
  const markings: MarkingIncludes[] = await prisma.marking.findMany({
    where: {
      critter_id: critter_id,
    },
    ...markingIncludes,
  });
  return markings;
};

/**
 * * Updates a marking in the database
 * @param {string} marking_id
 * @param {MarkingUpdateInput} marking_data
 */
const updateMarking = async (
  marking_id: string,
  marking_data: MarkingUpdateInput
): Promise<MarkingIncludes> => {
  const marking: MarkingIncludes = await prisma.marking.update({
    where: {
      marking_id: marking_id,
    },
    data: marking_data,
    ...markingIncludes,
  });
  return marking;
};

/**
 * * Creates a new marking in the database
 * * Valid reference to existing critter_id and taxon_marking_body_location_id UUIDs must be provided
 * @param {MarkingCreateInput} newMarkingData
 */
const createMarking = async (newMarkingData: MarkingCreateInput) => {
  const marking = await prisma.marking.create({
    data: newMarkingData,
    ...markingIncludes,
  });
  return marking;
};

/**
 * * Removes a marking from the database
 * @param {string} marking_id
 */
const deleteMarking = async (
  marking_id: string,
  prismaOverride?: PrismaTransactionClient
): Promise<MarkingIncludes> => {
  const client = prismaOverride ?? prisma;
  const marking: MarkingIncludes = await client.marking.delete({
    where: {
      marking_id: marking_id,
    },
    ...markingIncludes,
  });
  return marking;
};
//TODO remove
const appendEnglishMarkingsAsUUID = async (
  body: ReqBody<{
    primary_colour: string;
    secondary_colour: string;
    body_location: string;
    marking_type: string;
  }>,
  itis_tsn: number
) => {
  if (body.primary_colour) {
    const col = await getColourByName(body.primary_colour);
    body.primary_colour_id = col?.colour_id;
  }
  if (body.secondary_colour) {
    const col = await getColourByName(body.secondary_colour);
    body.secondary_colour_id = col?.colour_id;
  }
  if (body.body_location) {
    const loc = await getBodyLocationByNameAndTsn(body.body_location, itis_tsn);
    body.taxon_marking_body_location_id = loc?.taxon_marking_body_location_id;
  }
  if (body.marking_type) {
    const marking_type = await getMarkingTypeByName(body.marking_type);
    body.marking_type_id = marking_type?.marking_type_id;
  }
  return body;
};

export {
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
  createMarking,
  deleteMarking,
  appendEnglishMarkingsAsUUID,
};
