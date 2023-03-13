import { prisma } from "../../utils/constants";
import type { critter, Prisma } from "@prisma/client";
import { apiError } from "../../utils/types";

const getAllCritters = async (): Promise<critter[]> => {
  return await prisma.critter.findMany();
};

const getCritterById = async (critter_id: string): Promise<critter | null> => {
  return await prisma.critter.findUnique({
    where: { critter_id: critter_id}
  })
}

const getCritterByIdWithDetails = async (critter_id: string): Promise<critter | null> => {
  const critter = await prisma.critter.findUnique({
    include: {
      marking: true, 
      measurement_qualitative: true,
      measurement_quantitative: true
    },
    where: {
      critter_id: critter_id
    }
  })
  return critter;
}

const getCritterByWlhId = async (wlh_id: string): Promise<critter[] | null> => {
  // Might seem weird to return critter array here but it's already well known that WLH ID
  // is not able to guarnatee uniqueness so I think this makes sense.
  return await prisma.critter.findMany({
    where: { wlh_id: wlh_id}
  })
}

const updateCritter = async (critter_id: string, critter_data: Prisma.critterUpdateInput): Promise<critter> => {
  if(!critter_id) {
    throw apiError.requiredProperty('Updating critter requires a valid critter_id')
  }

  //Don't think you should be allowed to overwrite an existing critter_id with a different one. 
  delete critter_data.critter_id;

  return prisma.critter.update({
    where: {
      critter_id: critter_id
    },
    data: critter_data
  })
}

const createCritter = async (critter_data: Prisma.critterUncheckedCreateInput): Promise<critter> => {
  if(critter_data.critter_id) {
    const existing = await prisma.critter.findUnique({
      where: { critter_id: critter_data.critter_id}
    });
    if(existing) {
      throw apiError.conflictIssue('Creation of duplicate critter ID is not allowed');
    }
  }
  
  const critter = await prisma.critter.create({
    data: critter_data
  })
  return critter;
}

const deleteCritter = async (critter_id: string): Promise<critter> => {
  const critter = await prisma.critter.delete({
    where: {
      critter_id: critter_id
    }
  })
  return critter;
}

export { getAllCritters, getCritterById, getCritterByWlhId, updateCritter, createCritter, deleteCritter, getCritterByIdWithDetails };
