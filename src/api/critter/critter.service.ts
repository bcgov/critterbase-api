import { critter } from "@prisma/client";
import { prisma } from "../../utils/constants";
import {
  CritterCreate,
  CritterIdsRequest,
  CritterUpdate,
  detailedCritterInclude,
  simpleCritterInclude,
} from "./critter.utils";

const getAllCritters = async (): Promise<critter[]> => {
  return await prisma.critter.findMany();
};

/**
 * Fetch multiple critters by their IDs
 * Returns minimal required data for faster response
 */
const getMultipleCrittersByIds = async (
  critterIds: CritterIdsRequest
): Promise<Pick<critter, 'critter_id' | 'wlh_id' | 'animal_id'>[]> => {

  const tim1 = performance.now();

  const results = await prisma.critter.findMany({
    select: {
      critter_id: true,
      wlh_id: true,
      animal_id: true,
      ...simpleCritterInclude,
    },
    where: {
      critter_id: {
        in: critterIds.critter_ids,
      },
    },
  });

  console.log(`Operation took ${performance.now() - tim1} ms`)

  return results;
};

const getCritterById = async (critter_id: string): Promise<critter | null> => {
  return await prisma.critter.findUniqueOrThrow({
    where: { critter_id: critter_id },
  });
};

const getCritterByIdWithDetails = async (critter_id: string) => {
  const result = await prisma.critter.findUniqueOrThrow({
    include: detailedCritterInclude,
    where: {
      critter_id: critter_id,
    },
  });

  return result;
};

const getCritterByWlhId = async (wlh_id: string): Promise<critter[]> => {
  // Might seem weird to return critter array here but it's already well known that WLH ID
  // is not able to guarnatee uniqueness so I think this makes sense.
  const results = await prisma.critter.findMany({
    include: detailedCritterInclude,
    where: {
      wlh_id: wlh_id,
    },
  });

  return results;
};

const updateCritter = async (
  critter_id: string,
  critter_data: CritterUpdate
): Promise<critter> => {
  return prisma.critter.update({
    where: {
      critter_id: critter_id,
    },
    data: critter_data,
  });
};

const createCritter = async (critter_data: CritterCreate): Promise<critter> => {
  const critter = await prisma.critter.create({
    data: critter_data,
  });
  return critter;
};

const deleteCritter = async (critter_id: string): Promise<critter> => {
  const critter = await prisma.critter.delete({
    where: {
      critter_id: critter_id,
    },
  });
  return critter;
};

export {
  getAllCritters,
  getCritterById,
  getCritterByWlhId,
  updateCritter,
  createCritter,
  deleteCritter,
  getCritterByIdWithDetails,
  getMultipleCrittersByIds,
};
