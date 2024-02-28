import { prisma } from "../../utils/constants";
import { artifact } from "@prisma/client";
import {
  ArtifactCreate,
  ArtifactResponse,
  ArtifactUpdate
} from "./artifact.utils";
import { randomUUID } from "crypto";
import {
  Metadata,
  getFileDownloadUrl,
  uploadFileToS3
} from "../../utils/object_store";

/**
 * * Gets an artifact by the artifact_id
 * * Returns null if non-existent
 * @param {string} artifact_id
 */
const getArtifactById = async (
  artifact_id: string
): Promise<ArtifactResponse> => {
  const artifact = await prisma.artifact.findUniqueOrThrow({
    where: {
      artifact_id: artifact_id
    }
  });
  return addSignedUrlToArtifact(artifact);
};

/**
 * * Gets an array of artifacts by the critter_id
 * @param {string} critter_id
 */
const getArtifactsByCritterId = async (
  critter_id: string
): Promise<ArtifactResponse[]> => {
  const artifacts = await prisma.artifact.findMany({
    where: {
      critter_id: critter_id
    }
  });
  return addSignedUrlToArtifacts(artifacts);
};

/**
 * Gets all artifacts from the database
 */
const getAllArtifacts = async (): Promise<ArtifactResponse[]> => {
  const artifacts = await prisma.artifact.findMany();
  return addSignedUrlToArtifacts(artifacts);
};

/**
 * * Updates an existing artifact in the database
 * @param {string} artifact_id
 * @param {ArtifactUpdate} artifact_data
 */
const updateArtifact = async (
  artifact_id: string,
  artifact_data: ArtifactUpdate
): Promise<ArtifactResponse> => {
  const artifact = await prisma.artifact.update({
    where: {
      artifact_id: artifact_id
    },
    data: artifact_data
  });
  return addSignedUrlToArtifact(artifact);
};

/**
 * * Creates a new artifact in the database
 * * Artifact file is uploaded to S3 (Object Store) and the artifact_url is stored in the database
 * * Files are stored in a flat structure in the root of the bucket
 * * The file names follow the pattern: <artifact_id>_<original_file_name>.<file_extension>
 * * Because the files are stored in the root of the bucket, the artifact_url is simply the file name
 * @param {ArtifactCreate} artifact_data
 */
const createArtifact = async (
  artifact_data: ArtifactCreate,
  file: Express.Multer.File
): Promise<ArtifactResponse> => {
  const metadata: Metadata = {
    filename: file.originalname
  };
  const artifact_id = randomUUID();
  const artifact_url = await uploadFileToS3(file, artifact_id, metadata);
  const artifact = await prisma.artifact.create({
    data: { ...artifact_data, artifact_id, artifact_url }
  });
  return addSignedUrlToArtifact(artifact);
};

/**
 * * Removes an artifact from the database
 * * Resource will NOT be removed from object store
 * @param {string} artifact_id
 */
const deleteArtifact = async (artifact_id: string): Promise<artifact> => {
  return await prisma.artifact.delete({
    where: {
      artifact_id: artifact_id
    }
  });
};

/**
 * * Adds a signed URL to an artifact
 * @param {artifact} artifact
 */
const addSignedUrlToArtifact = async (
  artifact: artifact
): Promise<ArtifactResponse> => {
  const signed_url = await getFileDownloadUrl(artifact.artifact_url);
  return { ...artifact, signed_url };
};

/**
 * * Maps over an array of artifacts and adds a signed URL to each one
 * @param {artifact[]} artifacts
 */
const addSignedUrlToArtifacts = async (
  artifacts: artifact[]
): Promise<ArtifactResponse[]> =>
  Promise.all(artifacts.map(addSignedUrlToArtifact));

export {
  getArtifactById,
  getArtifactsByCritterId,
  getAllArtifacts,
  updateArtifact,
  createArtifact,
  deleteArtifact
};
