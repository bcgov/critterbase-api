import { prisma } from "../../utils/constants";
import type { marking, Prisma } from "@prisma/client";

const getAllMarkings = async (): Promise<marking[]> => {
  return await prisma.marking.findMany();
};

const getMarkingById = async (marking_id: string): Promise<marking | null> => {
  return await prisma.marking.findUnique({
    where: {
      marking_id: marking_id,
    },
  });
};

const updateMarking = async (
  marking_id: string,
  marking_data: Prisma.markingUpdateInput
): Promise<marking> => {
  return await prisma.marking.update({
    where: {
      marking_id: marking_id,
    },
    data: marking_data,
  });
};

const createMarking = async (
  newMarkingData: Prisma.markingCreateInput
): Promise<marking> => {
  return await prisma.marking.create({ data: newMarkingData });
};

const deleteMarking = async (marking_id: string): Promise<marking> => {
  return await prisma.marking.delete({
    where: {
      marking_id: marking_id,
    },
  });
};
