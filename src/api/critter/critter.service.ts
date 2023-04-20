import { critter } from "@prisma/client";
import { prisma } from "../../utils/constants";
import {
  CritterCreate,
  CritterIdsRequest,
  CritterIncludeResult,
  CritterUpdate,
  detailedCritterInclude,
  minimalCritterSelect,
} from "./critter.utils";
import { CritterSimpleResponse } from "./critter.utils";

const getAllCritters = async (
  minimal = false
): Promise<critter[] | CritterSimpleResponse[]> => {
  if (minimal) {
    return await prisma.critter.findMany(minimalCritterSelect);
  } else {
    return await prisma.critter.findMany();
  }
};

/**
 * Fetch multiple critters by their IDs
 * Returns minimal required data for faster response
 */
const getMultipleCrittersByIds = async (
  critterIds: CritterIdsRequest
): Promise<CritterSimpleResponse[]> => {
  const results = await prisma.critter.findMany({
    ...minimalCritterSelect,
    where: {
      critter_id: {
        in: critterIds.critter_ids,
      },
    },
  });
  return results;
};

const getCritterById = async (critter_id: string): Promise<critter> => {
  return await prisma.critter.findUniqueOrThrow({
    where: { critter_id: critter_id },
  });
};

const getCritterByIdWithDetails = async (
  critter_id: string
): Promise<CritterIncludeResult> => {
  const result = await prisma.critter.findUniqueOrThrow({
    ...detailedCritterInclude,
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
    ...detailedCritterInclude,
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
