import { prisma } from "../../utils/constants";
import type { critter } from "@prisma/client";

const getAllCritters = async (): Promise<critter[]> => {
  return await prisma.critter.findMany();
};

export { getAllCritters };
