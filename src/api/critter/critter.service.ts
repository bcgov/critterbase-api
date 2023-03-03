import { prisma } from "../../utils/constants";
import type { critter } from "@prisma/client";

const getCritters = async (): Promise<critter[]> => {
  const allCritters = await prisma.critter.findMany({
    where: { sex: "Male" },
  });
  return [];
};

export { getCritters };
