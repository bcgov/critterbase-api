import { prisma } from "../../utils/constants";
import type { critter_collection_unit, Prisma } from "@prisma/client";
import { CollectionUnitCreateInput, CollectionUnitUpdateInput } from "./collectionUnit.types";
/**
 * * Returns all existing critter collection units from the database
 */
const getAllCollectionUnits = async (): Promise<critter_collection_unit[]> => {
  return await prisma.critter_collection_unit.findMany();
};

/**
 * * Gets a critter collection unit by the critter_collection_unit_id
 * * Returns null if non-existent
 * @param {string} critter_collection_unit_id
 */
const getCollectionUnitById = async (
  critter_collection_unit_id: string
): Promise<critter_collection_unit> => {
  return await prisma.critter_collection_unit.findUniqueOrThrow({
    where: {
      critter_collection_unit_id: critter_collection_unit_id,
    },
  });
};

/**
 * * Gets an array of critter collection units by the critter_id (one critter can belong to many)
 * @param {string} critter_id
 */
const getCollectionUnitsByCritterId = async (
  critter_id: string
): Promise<critter_collection_unit[]> => {
  return await prisma.critter_collection_unit.findMany({
    where: {
      critter_id: critter_id,
    },
  });
};

/**
 * * Updates an existing critter collection unit in the database
 * @param {string} critter_collection_unit_id
 * @param {CollectionUnitUpdateInput} critter_collection_unit_data
 */
const updateCollectionUnit = async (
  critter_collection_unit_id: string,
  critter_collection_unit_data: CollectionUnitUpdateInput
): Promise<critter_collection_unit> => {
  return await prisma.critter_collection_unit.update({
    where: {
      critter_collection_unit_id: critter_collection_unit_id,
    },
    data: critter_collection_unit_data,
  });
};

/**
 * * Creates a new critter_collection_unit in the database
 * * Valid reference to existing critter_id and collection_unit_id UUIDs must be provided
 * @param {CollectionUnitCreateInput} critter_collection_unit_data
 */
const createCollectionUnit = async (
  critter_collection_unit_data: CollectionUnitCreateInput
): Promise<critter_collection_unit> => {
  return await prisma.critter_collection_unit.create({
    data: critter_collection_unit_data,
  });
};

/**
 * * Removes a critter collection unit from the database
 * @param {string} critter_collection_unit_id
 */
const deleteCollectionUnit = async (
  critter_collection_unit_id: string
): Promise<critter_collection_unit> => {
  return await prisma.critter_collection_unit.delete({
    where: {
      critter_collection_unit_id: critter_collection_unit_id,
    },
  });
};

export {
  getAllCollectionUnits,
  getCollectionUnitById,
  getCollectionUnitsByCritterId,
  updateCollectionUnit,
  createCollectionUnit,
  deleteCollectionUnit,
};
