import { prisma } from "../../utils/constants";
import type { mortality } from "@prisma/client";
import { FormattedMortality, MortalityCreate, mortalityInclude, MortalityIncludeType, MortalityResponseSchema } from "./mortality.types";

const getAllMortalities = async (): Promise<mortality[]> => {
  return await prisma.mortality.findMany();
};

const getMortalityById = async (mortality_id: string): Promise<mortality | null> => {
  const mort = await prisma.mortality.findUnique({
    ...mortalityInclude,
    where: {
      mortality_id: mortality_id
    }
  });
  
  return mort;
}

const getMortalityByCritter = async (critter_id: string): Promise<mortality[]> => {
  const mortalities = await prisma.mortality.findMany({
    ...mortalityInclude,
    where: {
      critter_id: critter_id
    }
  });
  return mortalities;
}

const createMortality = async (mortality_data: MortalityCreate): Promise<mortality> => {
  return await prisma.mortality.create({
    data: mortality_data
  })
}

const updateMortality = async (mortality_id: string, mortality_data: MortalityCreate) => {
  return await prisma.mortality.update({
    data: mortality_data,
    where: {
      mortality_id: mortality_id
    }
  })
}

const deleteMortality = async (mortality_id: string) => {
  return await prisma.mortality.delete({
    where: {
      mortality_id: mortality_id
    }
  })
}

export { getAllMortalities, getMortalityById, getMortalityByCritter, createMortality, updateMortality, deleteMortality };
