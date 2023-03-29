import { prisma } from "../../utils/constants";
import {
  CollectionUnitCreateInput,
  collectionUnitIncludes,
  CollectionUnitResponse,
  collectionUnitResponseSchema,
  CollectionUnitUpdateInput,
} from "./collectionUnit.types";
import { array } from "zod";
/**
 * * Returns all existing critter collection units from the database
 */
const getAllCollectionUnits = async (): Promise<CollectionUnitResponse[]> => {
  const res = await prisma.critter_collection_unit.findMany(
    collectionUnitIncludes
  );
  return array(collectionUnitResponseSchema).parse(res);
};

/**
 * * Gets a critter collection unit by the critter_collection_unit_id
 * * Throws 404 error if non-existent
 * @param {string} critter_collection_unit_id
 */
const getCollectionUnitById = async (
  critter_collection_unit_id: string
): Promise<CollectionUnitResponse> => {
  const res = await prisma.critter_collection_unit.findUniqueOrThrow({
    where: {
      critter_collection_unit_id: critter_collection_unit_id,
    },
    ...collectionUnitIncludes,
  });
  return collectionUnitResponseSchema.parse(res);
};

/**
 * * Gets an array of critter collection units by the critter_id (one critter can belong to many)
 * @param {string} critter_id
 */
const getCollectionUnitsByCritterId = async (
  critter_id: string
): Promise<CollectionUnitResponse[]> => {
  const res = await prisma.critter_collection_unit.findMany({
    where: {
      critter_id: critter_id,
    },
    ...collectionUnitIncludes,
  });
  return array(collectionUnitResponseSchema).parse(res);
};

/**
 * * Updates an existing critter collection unit in the database
 * @param {string} critter_collection_unit_id
 * @param {CollectionUnitUpdateInput} critter_collection_unit_data
 */
const updateCollectionUnit = async (
  critter_collection_unit_id: string,
  critter_collection_unit_data: CollectionUnitUpdateInput
): Promise<CollectionUnitResponse> => {
  const res = await prisma.critter_collection_unit.update({
    where: {
      critter_collection_unit_id: critter_collection_unit_id,
    },
    data: critter_collection_unit_data,
    ...collectionUnitIncludes,
  });
  return collectionUnitResponseSchema.parse(res);
};

/**
 * * Creates a new critter_collection_unit in the database
 * * Valid reference to existing critter_id and collection_unit_id UUIDs must be provided
 * @param {CollectionUnitCreateInput} critter_collection_unit_data
 */
const createCollectionUnit = async (
  critter_collection_unit_data: CollectionUnitCreateInput
): Promise<CollectionUnitResponse> => {
  const res = await prisma.critter_collection_unit.create({
    data: critter_collection_unit_data,
    ...collectionUnitIncludes,
  });
  return collectionUnitResponseSchema.parse(res);
};

/**
 * * Removes a critter collection unit from the database
 * @param {string} critter_collection_unit_id
 */
const deleteCollectionUnit = async (
  critter_collection_unit_id: string
): Promise<CollectionUnitResponse> => {
  const res = await prisma.critter_collection_unit.delete({
    where: {
      critter_collection_unit_id: critter_collection_unit_id,
    },
    ...collectionUnitIncludes,
  });
  return collectionUnitResponseSchema.parse(res);
};

export {
  getAllCollectionUnits,
  getCollectionUnitById,
  getCollectionUnitsByCritterId,
  updateCollectionUnit,
  createCollectionUnit,
  deleteCollectionUnit,
};
