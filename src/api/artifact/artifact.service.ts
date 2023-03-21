import { prisma } from "../../utils/constants";
import { artifact, Prisma } from "@prisma/client";
import { number, string, z } from "zod";
import { nonEmpty } from "../../utils/zod_schemas";

/**
 * * Gets an artifact by the artifact_id
 * * Returns null if non-existent
 * @param {string} artifact_id
 */
const getArtifactById = async (
  artifact_id: string
): Promise<artifact | null> => {
  return await prisma.artifact.findUnique({
    where: {
      artifact_id: artifact_id,
    },
  });
};

/**
 * * Gets an array of artifacts by the critter_id
 * @param {string} critter_id
 */
const getArtifactsByCritterId = async (
  critter_id: string
): Promise<artifact[]> => {
  return await prisma.artifact.findMany({
    where: {
      critter_id: critter_id,
    },
  });
};

export { getArtifactById, getArtifactsByCritterId };
