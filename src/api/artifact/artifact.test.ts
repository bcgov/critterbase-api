import { artifact } from "@prisma/client";
import { randomInt, randomUUID } from "crypto";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import {
  ArtifactCreate,
  ArtifactUpdate,
  artifactSchema,
} from "./artifact.utils";
import {
  createArtifact as _createArtifact,
  deleteArtifact as _deleteArtifact,
  getAllArtifacts as _getAllArtifacts,
  getArtifactById as _getArtifactById,
  getArtifactsByCritterId as _getArtifactsByCritterId,
  updateArtifact as _updateArtifact,
} from "./artifact.service";
import { apiError } from "../../utils/types";
import { makeApp } from "../../app";
import supertest from "supertest";

// Mock Artifact
const ID = randomUUID();
const CRITTER_ID = randomUUID();

const NEW_ARTIFACT: ArtifactCreate = {
  critter_id: CRITTER_ID,
  artifact_url: "https://example.com/artifact",
};

const RETURN_ARTIFACT: artifact = {
  ...NEW_ARTIFACT,
  artifact_id: ID,
  artifact_comment: null,
  capture_id: null,
  mortality_id: null,
  measurement_qualitative: null,
  measurement_quantitative: null,
  create_user: ID,
  update_user: ID,
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

// Mocked Prisma Calls
const create = jest.spyOn(prisma.artifact, "create").mockImplementation();
const findMany = jest.spyOn(prisma.artifact, "findMany").mockImplementation();
const findUniqueOrThrow = jest
  .spyOn(prisma.artifact, "findUniqueOrThrow")
  .mockImplementation();
const update = jest.spyOn(prisma.artifact, "update").mockImplementation();
const pDelete = jest.spyOn(prisma.artifact, "delete").mockImplementation();

// Mocked Services
const getArtifactById = jest.fn();
const getArtifactsByCritterId = jest.fn();
const getAllArtifacts = jest.fn();
const updateArtifact = jest.fn();
const createArtifact = jest.fn();
const deleteArtifact = jest.fn();

const request = supertest(
  makeApp({
    getArtifactById,
    getArtifactsByCritterId,
    getAllArtifacts,
    updateArtifact,
    createArtifact,
    deleteArtifact,
  } as Record<keyof ICbDatabase, any>)
);

beforeEach(() => {
  // Reset mocked services
  getArtifactById.mockReset();
  getArtifactsByCritterId.mockReset();
  getAllArtifacts.mockReset();
  updateArtifact.mockReset();
  createArtifact.mockReset();
  deleteArtifact.mockReset();

  // Set default returns
});
describe("API: Artifact", () => {
  describe("SERVICES", () => {
    describe("createArtifact()", () => {
      it("returns an artifact", async () => {
        create.mockResolvedValue(RETURN_ARTIFACT);
        const returnedArtifact = await _createArtifact(NEW_ARTIFACT);
        expect.assertions(2);
        expect(prisma.artifact.create).toHaveBeenCalledTimes(1);
        expect(artifactSchema.safeParse(returnedArtifact).success).toBe(true);
      });
    });

    describe("getArtifactsByCritterId()", () => {
      it("returns a list of artifacts", async () => {
        findMany.mockResolvedValue([RETURN_ARTIFACT]);
        const returnedArtifacts = await _getArtifactsByCritterId(CRITTER_ID);
        expect.assertions(3);
        expect(prisma.artifact.findMany).toHaveBeenCalledTimes(1);
        expect(returnedArtifacts).toBeInstanceOf(Array);
        expect(returnedArtifacts.length).toBe(1);
      });
    });

    describe("getAllArtifacts()", () => {
      it("returns a list of all artifacts", async () => {
        findMany.mockResolvedValue([RETURN_ARTIFACT]);
        const returnedArtifacts = await _getAllArtifacts();
        expect.assertions(3);
        expect(prisma.artifact.findMany).toHaveBeenCalledTimes(1);
        expect(returnedArtifacts).toBeInstanceOf(Array);
        expect(returnedArtifacts.length).toBe(1);
      });
    });

    describe("getArtifactById()", () => {
      it("returns an artifact by ID", async () => {
        findUniqueOrThrow.mockResolvedValue(RETURN_ARTIFACT);
        const returnedArtifact = await _getArtifactById(ID);
        expect.assertions(2);
        expect(prisma.artifact.findUniqueOrThrow).toHaveBeenCalledTimes(1);
        expect(artifactSchema.safeParse(returnedArtifact).success).toBe(true);
      });
    });

    describe("updateArtifact()", () => {
      it("returns an updated artifact", async () => {
        const UPDATED_ARTIFACT: ArtifactUpdate = {
          artifact_url: "https://example.com/artifact_updated",
        };
        update.mockResolvedValue({ ...RETURN_ARTIFACT, ...UPDATED_ARTIFACT });
        const returnedArtifact = await _updateArtifact(ID, UPDATED_ARTIFACT);
        expect.assertions(3);
        expect(prisma.artifact.update).toHaveBeenCalledTimes(1);
        expect(prisma.artifact.update).toHaveBeenCalledWith({
          where: { artifact_id: ID },
          data: UPDATED_ARTIFACT,
        });
        expect(artifactSchema.safeParse(returnedArtifact).success).toBe(true);
      });
    });

    describe("deleteArtifact()", () => {
      it("returns deleted artifact and removes artifact from database", async () => {
        pDelete.mockResolvedValue(RETURN_ARTIFACT);
        const deletedArtifact = await _deleteArtifact(ID);
        expect.assertions(3);
        expect(prisma.artifact.delete).toHaveBeenCalledTimes(1);
        expect(prisma.artifact.delete).toHaveBeenCalledWith({
          where: { artifact_id: ID },
        });
        expect(artifactSchema.safeParse(deletedArtifact).success).toBe(true);
      });
    });
  });
});
