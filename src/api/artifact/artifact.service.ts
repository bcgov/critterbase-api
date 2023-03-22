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

/**
 * * Updates an existing artifact in the database
 * @param {string} artifact_id
 * @param {Prisma.artifactUncheckedUpdateInput} artifact_data
 */
const updateArtifact = async (
  artifact_id: string,
  artifact_data: Prisma.artifactUncheckedUpdateInput
): Promise<artifact> => {
  return await prisma.artifact.update({
    where: {
      artifact_id: artifact_id,
    },
    data: artifact_data,
  });
};

/**
 * * Creates a new artifact in the database
 * * Valid reference to existing critter_id and artifact_url must be provided
 * @param {Prisma.artifactUncheckedCreateInput} artifact_data
 */
const createArtifact = async (
  artifact_data: Prisma.artifactUncheckedCreateInput
): Promise<artifact> => {
  return await prisma.artifact.create({
    data: artifact_data,
  });
};

/**
 * * Removes an artifact from the database
 * @param {string} artifact_id
 */
const deleteArtifact = async (artifact_id: string): Promise<artifact> => {
  return await prisma.artifact.delete({
    where: {
      artifact_id: artifact_id,
    },
  });
};

export {
  getArtifactById,
  getArtifactsByCritterId,
  updateArtifact,
  createArtifact,
  deleteArtifact,
};
