import { prisma } from "../../utils/constants";
import type { critter } from "@prisma/client";

const getAllCritters = async (): Promise<critter[]> => {
  return await prisma.critter.findMany();
};

const getCritterById = async (critter_to_find: string): Promise<critter | null> => {
  return await prisma.critter.findFirst({
    where: { critter_id: critter_to_find}
  })
}

export { getAllCritters };
