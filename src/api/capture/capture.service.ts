import { prisma } from "../../utils/constants";
import type { capture } from "@prisma/client";

const getAllCaptures = async (): Promise<capture[]> => {
  return await prisma.capture.findMany();
};

const getCaptureById = async (capture_id: string): Promise<capture | null> => {
  return await prisma.capture.findUnique({
    where: {
      capture_id: capture_id
    }
  })
}

const getCaptureByCritter = async (critter_id: string): Promise<capture[] | null> => {
  return await prisma.capture.findMany({
    where: {
      critter_id: critter_id
    }
  })
}

export { getAllCaptures };
