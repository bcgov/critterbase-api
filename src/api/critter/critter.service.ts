import { critter } from "@prisma/client";
import { prisma } from "../../utils/constants";
import {
  CritterCreate,
  CritterUpdate,
  formattedCritterInclude,
} from "./critter.utils";

const getAllCritters = async (): Promise<critter[]> => {
  return await prisma.critter.findMany();
};

const getCritterById = async (critter_id: string): Promise<critter | null> => {
  return await prisma.critter.findUniqueOrThrow({
    where: { critter_id: critter_id },
  });
};

const getCritterByIdWithDetails = async (critter_id: string) => {
  const result = await prisma.critter.findUniqueOrThrow({
    include: formattedCritterInclude,
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
    include: formattedCritterInclude,
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
};
