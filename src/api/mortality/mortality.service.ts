import { prisma } from "../../utils/constants";
import type { mortality } from "@prisma/client";
import {
  MortalityCreate,
  mortalityInclude,
  MortalityUpdate,
} from "./mortality.utils";

const getAllMortalities = async (): Promise<mortality[]> => {
  return await prisma.mortality.findMany();
};

const getMortalityById = async (mortality_id: string) => {
  const mort = await prisma.mortality.findUniqueOrThrow({
    where: {
      mortality_id: mortality_id,
    },
    include: mortalityInclude,
  });

  return mort;
};

const getMortalityByCritter = async (critter_id: string) => {
  const mortalities = await prisma.mortality.findMany({
    where: {
      critter_id: critter_id,
    },
    include: mortalityInclude,
  });
  return mortalities;
};

const createMortality = async (
  mortality_data: MortalityCreate
): Promise<mortality> => {
  return await prisma.mortality.create({
    data: mortality_data,
  });
};

const updateMortality = async (
  mortality_id: string,
  mortality_data: MortalityUpdate
) => {
  return await prisma.mortality.update({
    data: mortality_data,
    where: {
      mortality_id: mortality_id,
    },
  });
};

const deleteMortality = async (mortality_id: string) => {
  return await prisma.mortality.delete({
    where: {
      mortality_id: mortality_id,
    },
  });
};

export {
  getAllMortalities,
  getMortalityById,
  getMortalityByCritter,
  createMortality,
  updateMortality,
  deleteMortality,
};
