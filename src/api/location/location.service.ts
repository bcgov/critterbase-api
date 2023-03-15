import { location } from "@prisma/client";
import { prisma } from "../../utils/constants";

const getLocation = async (id: string): Promise<location | null> => {
  return await prisma.location.findUnique({
    where: {
      location_id: id,
    },
  });
};

const getAllLocations = async (): Promise<location[]> => {
  return await prisma.location.findMany();
};

const deleteLocation = async (id: string): Promise<location> => {
  return await prisma.location.delete({
    where: {
      location_id: id,
    },
  });
};
export { getAllLocations, getLocation, deleteLocation };
