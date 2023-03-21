import { prisma } from "../../utils/constants";
import type { mortality } from "@prisma/client";

const getAllMortalities = async (): Promise<mortality[]> => {
  return await prisma.mortality.findMany();
};

const

export { getAllMortalities };
