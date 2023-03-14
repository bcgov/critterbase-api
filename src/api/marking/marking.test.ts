import { prisma, request } from "../../utils/constants";
import {
  createMarking,
  deleteMarking,
  getAllMarkings,
  getMarkingById,
  updateMarking,
} from "./marking.service";
import type { Prisma, marking } from "@prisma/client";
import { randomInt } from "crypto";

let dummyMarking: marking;
let dummyMarkingInput: Prisma.markingCreateInput;
let dummyCritterId: string | undefined;
let dummyTaxonMarkingId: string | undefined;

/**
 * * Creates a new marking object that references an existing critter and marking location
 * @return {*}  {Promise<Prisma.markingCreateInput>}
 */
async function newMarking(): Promise<Prisma.markingCreateInput> {
  const dummyCritterId: string | undefined = (
    await prisma.marking.findFirst({
      select: {
        critter_id: true,
      },
    })
  )?.critter_id;
  if (!dummyCritterId) throw Error("Could not get critter_id for dummy.");
  const dummyTaxonMarkingId: string | undefined = (
    await prisma.marking.findFirst({
      select: {
        xref_taxon_marking_body_location: true,
      },
    })
  )?.xref_taxon_marking_body_location.taxon_marking_body_location_id;
  if (!dummyTaxonMarkingId)
    throw Error("Could not get taxon_marking_body_location_id for dummy.");
  const dummyMarking: Prisma.markingCreateInput = {
    critter: { connect: { critter_id: dummyCritterId } },
    xref_taxon_marking_body_location: {
      connect: { taxon_marking_body_location_id: dummyTaxonMarkingId },
    },
    identifier: `TEST_MARKING_${randomInt(99999999)}`,
  };
  return dummyMarking;
}

beforeAll(async () => {
  // Sets a global dummy marking to reduce complexity on similar tests
  dummyMarkingInput = await newMarking();
  dummyCritterId = dummyMarkingInput.critter.connect?.critter_id;
  dummyTaxonMarkingId =
    dummyMarkingInput.xref_taxon_marking_body_location.connect
      ?.taxon_marking_body_location_id;
  dummyMarking = await prisma.marking.create({ data: dummyMarkingInput });
});

describe("API: Marking", () => {
  describe("SERVICES", () => {
    describe("createMarking()", () => {
      it("creates a new marking", async () => {
        const newMarkingInput = await newMarking();
        const critterId = newMarkingInput.critter.connect?.critter_id;
        const taxonMarkingId =
          newMarkingInput.xref_taxon_marking_body_location.connect
            ?.taxon_marking_body_location_id;
        const marking = await createMarking(newMarkingInput);
        expect.assertions(3);
        expect(marking.critter_id).toBe(critterId);
        expect(marking.taxon_marking_body_location_id).toBe(taxonMarkingId);
        expect(marking.identifier).toBe(newMarkingInput.identifier);
      });
    });

    describe("getAllMarkings()", () => {
      it("returns an array of markings", async () => {
        const markings = await getAllMarkings();
        expect.assertions(2);
        expect(markings).toBeInstanceOf(Array);
        expect(markings.length).toBeGreaterThan(0);
      });
      // TODO: validate returned objects
      //   it("returns markings with correct properties", async () => {
      //     const markings = await getAllMarkings();
      //     expect.assertions(markings.length);
      //     for
      //   });
    });

    describe("getMarkingById()", () => {
      it("returns the expected marking", async () => {
        const marking = await getMarkingById(dummyMarking.marking_id);
        expect.assertions(1);
        expect(marking).toStrictEqual(dummyMarking);
      });
    });

    describe("updateMarking()", () => {
      it("updates a marking", async () => {
        const marking = await prisma.marking.create({
          data: await newMarking(),
        });
        const newData = {
          identifier: `UPDATED_MARKING_${randomInt(99999999)}`,
          comment: "NEW COMMENT",
        };
        const updatedMarking = await updateMarking(marking.marking_id, newData);
        expect.assertions(2);
        expect(updatedMarking).toStrictEqual({
          ...marking,
          ...newData,
          update_timestamp: updatedMarking.update_timestamp, // Ignore this field as it will be different
        });
        expect(
          updatedMarking.update_timestamp === marking.update_timestamp
        ).toBeFalsy();
      });
    });

    describe("deleteMarking()", () => {
      it("deletes a marking", async () => {
        const marking = await prisma.marking.create({
          data: await newMarking(),
        });
        const deletedMarking = await deleteMarking(marking.marking_id);
        const markingCheck = await prisma.marking.findUnique({
          where: { marking_id: marking.marking_id },
        });
        expect.assertions(2);
        expect(deletedMarking).toStrictEqual(marking);
        expect(markingCheck).toBeNull();
      });
    });
  });
});

afterAll(async () => {
  await prisma.marking.deleteMany({
    where: { identifier: { startsWith: "TEST_MARKING_" } },
  });
});
