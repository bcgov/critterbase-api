import { critter } from "@prisma/client";
import { defaultFormat, prisma } from "../../utils/constants";
import { QueryFormats } from "../../utils/types";
import {
  CritterCreate,
  CritterIdsRequest,
  CritterUpdate,
  critterFormatOptions,
} from "./critter.utils";

const getAllCritters = async (format = defaultFormat) => {
  return await prisma.critter.findMany({
    ...critterFormatOptions[format]?.prismaIncludes,
    where: {},
  });
};

/**
 * Fetch multiple critters by their IDs
 * Returns minimal required data for faster response
 */
const getMultipleCrittersByIds = async (
  critterIds: CritterIdsRequest,
  format = defaultFormat
) => {
  const results = await prisma.critter.findMany({
    ...critterFormatOptions[format]?.prismaIncludes,
    where: {
      critter_id: {
        in: critterIds.critter_ids,
      },
    },
  });
  return results;
};

const getCritterById = async (critter_id: string, format = defaultFormat) => {
  return await prisma.critter.findUniqueOrThrow({
    ...critterFormatOptions[format]?.prismaIncludes,
    where: { critter_id: critter_id },
  });
};

const getCritterByIdWithDetails = async (
  critter_id: string,
  format = defaultFormat
) => {
  const result = await prisma.critter.findUniqueOrThrow({
    ...critterFormatOptions[format]?.prismaIncludes,
    where: {
      critter_id: critter_id,
    },
  });

  return result;
};

const getCritterByWlhId = async (wlh_id: string, format = defaultFormat) => {
  // Might seem weird to return critter array here but it's already well known that WLH ID
  // is not able to guarnatee uniqueness so I think this makes sense.
  const results = await prisma.critter.findMany({
    ...critterFormatOptions[format]?.prismaIncludes,
    where: {
      wlh_id: wlh_id,
    },
  });

  return results;
};

const updateCritter = async (
  critter_id: string,
  critter_data: CritterUpdate,
  format = defaultFormat
) => {
  return prisma.critter.update({
    ...critterFormatOptions[format]?.prismaIncludes,
    where: {
      critter_id: critter_id,
    },
    data: critter_data,
  });
};

const createCritter = async (
  critter_data: CritterCreate,
  format = defaultFormat
) => {
  const critter = await prisma.critter.create({
    ...critterFormatOptions[format]?.prismaIncludes,
    data: critter_data,
  });
  return critter;
};

const deleteCritter = async (critter_id: string, format = defaultFormat) => {
  const critter = await prisma.critter.delete({
    ...critterFormatOptions[format]?.prismaIncludes,
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
