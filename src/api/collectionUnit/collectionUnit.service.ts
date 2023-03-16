import { prisma } from "../../utils/constants";
import type { critter_collection_unit,Prisma } from "@prisma/client";
import { isValidObject } from "../../utils/helper_functions";

/**
 * * Returns all existing markings from the database
 */
const getAllMarkings = async (): Promise<critter_collection_unit[]> => {
    return await prisma.critter_collection_unit.findMany();
  };