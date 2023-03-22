import { artifact } from "@prisma/client";
import { randomInt } from "crypto";
import { prisma } from "../../utils/constants";
import { ArtifactCreate, ArtifactUpdate } from "./artifact.types";
import {
  createArtifact,
  deleteArtifact,
  getAllArtifacts,
  getArtifactById,
  getArtifactsByCritterId,
  updateArtifact,
} from "./artifact.service";

/**
 * * Creates a random input for an artifact with reference to a valid critter_id
 */
async function newArtifact(): Promise<ArtifactCreate> {
  const totalRows = await prisma.critter.count();
  const critter = await prisma.critter.findFirst({
    skip: Math.floor(Math.random() * totalRows),
  });
  if (!critter) {
    throw Error("Could not find Critter for dummy.");
  }
  return {
    critter_id: critter?.critter_id,
    artifact_url: `https://example.com/artifact${randomInt(999999999)}.jpeg`,
    artifact_comment: `TEST_COMMENT_${randomInt(999999999)}`,
  };
}

describe("API: Artifact", () => {
  let dummyArtifact: artifact;
  let dummyArtifactKeys: string[];
  beforeAll(async () => {
    dummyArtifact = await prisma.artifact.create({ data: await newArtifact() });
    dummyArtifactKeys = Object.keys(dummyArtifact);
  });

  describe("SERVICES", () => {
    describe("createArtifact()", () => {
      it("creates a new artifact", async () => {
        const newArtifactInput = await newArtifact();
        const artifact = await createArtifact(newArtifactInput);
        expect(artifact).toEqual(expect.objectContaining(newArtifactInput));
      });
    });

    describe("getAllArtifacts()", () => {
      it("returns an array of artifacts", async () => {
        const artifacts = await getAllArtifacts();
        expect.assertions(2);
        expect(artifacts).toBeInstanceOf(Array);
        expect(artifacts.length).toBeGreaterThan(0);
      });

      it("returns artifacts with correct properties", async () => {
        const artifacts = await getAllArtifacts();
        expect.assertions(artifacts.length * dummyArtifactKeys.length);
        for (const artifact of artifacts) {
          for (const key of dummyArtifactKeys) {
            expect(artifact).toHaveProperty(key);
          }
        }
      });
    });

    describe("getArtifactById()", () => {
      it("returns the expected artifact", async () => {
        const artifact = await getArtifactById(dummyArtifact.artifact_id);
        expect.assertions(1);
        expect(artifact).toStrictEqual(dummyArtifact);
      });
    });

    describe("getArtifactsByCritterId", () => {
      it("returns an array of artifacts with the expected critter ID", async () => {
        // create another record with the same critter_id
        const artifactInput = await newArtifact();
        await prisma.artifact.create({
          data: { ...artifactInput, critter_id: dummyArtifact.critter_id },
        });
        const returnedArtifacts = await getArtifactsByCritterId(
          dummyArtifact.critter_id
        );
        expect.assertions(1 + returnedArtifacts.length);
        expect(returnedArtifacts.length).toBeGreaterThanOrEqual(2); // At least two artifacts tied to this critter
        for (const artifact of returnedArtifacts) {
          expect(artifact.critter_id).toBe(dummyArtifact.critter_id);
        }
      });
    });

    describe("updateArtifact()", () => {
      it("updates an artifact", async () => {
        const artifact = await prisma.artifact.create({
          data: await newArtifact(),
        });
        const newData = {
          artifact_comment: `TEST_COMMENT_UPDATED${randomInt(99999999)}`,
        };
        const updatedArtifact = await updateArtifact(
          artifact.artifact_id,
          newData
        );
        expect.assertions(2);
        expect(updatedArtifact).toStrictEqual({
          ...artifact,
          ...newData,
          update_timestamp: updatedArtifact.update_timestamp, // Ignore this field as it will be different
        });
        expect(
          updatedArtifact.update_timestamp === artifact.update_timestamp
        ).toBeFalsy();
      });
    });

    describe("deleteArtifact()", () => {
      it("deletes a artifact", async () => {
        const artifact = await prisma.artifact.create({
          data: await newArtifact(),
        });
        const deletedArtifact = await deleteArtifact(artifact.artifact_id);
        const artifactCheck = await prisma.artifact.findUnique({
          where: { artifact_id: artifact.artifact_id },
        });
        expect.assertions(2);
        expect(deletedArtifact).toStrictEqual(artifact);
        expect(artifactCheck).toBeNull();
      });
    });
  });
  afterAll(async () => {
    await prisma.artifact.deleteMany({
      where: { artifact_comment: { startsWith: "TEST_COMMENT" } },
    });
  });
});
