import { prisma } from "../../utils/constants";
import type { critter_collection_unit, Prisma } from "@prisma/client";
import { isValidObject } from "../../utils/helper_functions";
import { z } from "zod";

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
): Promise<critter_collection_unit | null> => {
  return await prisma.critter_collection_unit.findUnique({
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
 * @param {Prisma.critter_collection_unitUncheckedUpdateInput} critter_collection_unit_data
 */
const updateCollectionUnit = async (
  critter_collection_unit_id: string,
  critter_collection_unit_data: Prisma.critter_collection_unitUncheckedUpdateInput
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
 * @param {Prisma.critter_collection_unitUncheckedCreateInput} critter_collection_unit_data
 */
const createCollectionUnit = async (
  critter_collection_unit_data: Prisma.critter_collection_unitUncheckedCreateInput
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

// Zod schema to validate create collection unit data
const CreateCollectionUnitSchema = z.object({
  critter_id: z.string().uuid(),
  collection_unit_id: z.string().uuid(),
});

// Zod schema to validate update collection unit data
const UpdateCollectionUnitSchema = CreateCollectionUnitSchema.partial();

export {
  getAllCollectionUnits,
  getCollectionUnitById,
  getCollectionUnitsByCritterId,
  updateCollectionUnit,
  createCollectionUnit,
  deleteCollectionUnit,
  CreateCollectionUnitSchema,
  UpdateCollectionUnitSchema,
};
