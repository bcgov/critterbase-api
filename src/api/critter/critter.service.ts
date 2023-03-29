import { prisma } from "../../utils/constants";
import { critter, Prisma } from "@prisma/client";
import { apiError } from "../../utils/types";
import {  CritterCreate, CritterIncludeResult, CritterResponseSchema, CritterUpdate, FormattedCritter, formattedCritterInclude, FormattedMarking, FormattedQualitativeMeasurement, FormattedQuantitativeMeasurement, MarkingSubsetType, MeasurementQualitatitveSubsetType, MeasurementQuantiativeSubsetType } from "./critter.types";
import { formatLocation } from "../location/location.service";


const getAllCritters = async (): Promise<critter[]> => {
  return await prisma.critter.findMany();
};

const getCritterById = async (critter_id: string): Promise<critter | null> => {
  return await prisma.critter.findUnique({
    where: { critter_id: critter_id}
  });
}

const getCritterByIdWithDetails = async (critter_id: string): Promise<FormattedCritter | null> => {
  const result = await prisma.critter.findUnique({
    ...formattedCritterInclude,
    where: {
      critter_id: critter_id
    }
  });
  
  if(!result) {
    return null;
  }

  const formatted = CritterResponseSchema.parse(result);
  return formatted;
}

const getCritterByWlhId = async (wlh_id: string): Promise<FormattedCritter[]> => {
  // Might seem weird to return critter array here but it's already well known that WLH ID
  // is not able to guarnatee uniqueness so I think this makes sense.
  const results =  await prisma.critter.findMany({
   ...formattedCritterInclude,
   where: {
    wlh_id: wlh_id
   }
  })

  const formattedResults = results.map(r => CritterResponseSchema.parse(r));
  return formattedResults;
}

const updateCritter = async (critter_id: string, critter_data: CritterUpdate): Promise<critter> => {
  return prisma.critter.update({
    where: {
      critter_id: critter_id
    },
    data: critter_data
  })
}

const createCritter = async (critter_data: CritterCreate): Promise<critter> => {
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

export { 
  getAllCritters, 
  getCritterById, 
  getCritterByWlhId, 
  updateCritter, 
  createCritter, 
  deleteCritter, 
  getCritterByIdWithDetails
 };
