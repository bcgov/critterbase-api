import {
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
  location,
} from "@prisma/client";
import { prisma } from "../../utils/constants";
import { exclude } from "../../utils/helper_functions";

type LocationExcludes =
  | keyof location
  | "lk_region_env"
  | "lk_region_nr"
  | "lk_wildlife_management_unit";

const ex: LocationExcludes[] = [
  "wmu_id",
  "region_nr_id",
  "region_env_id",
  "lk_wildlife_management_unit",
  "lk_region_nr",
  "lk_region_env",
];

const subSelects = {
  include: {
    lk_wildlife_management_unit: {
      select: {
        wmu_name: true,
      },
    },
    lk_region_nr: {
      select: {
        region_nr_name: true,
      },
    },
    lk_region_env: {
      select: {
        region_env_name: true,
      },
    },
  },
};

const getLocation = async (id: string) => {
  const location = await prisma.location.findUnique({
    where: {
      location_id: id,
    },
    ...subSelects,
  });
  return location && exclude(location, ex);
};

const getAllLocations = async () => {
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
