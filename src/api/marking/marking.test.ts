import { prisma, request } from "../../utils/constants";
import {
  createMarking,
  getAllMarkings,
  getMarkingById,
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

      describe("getMarkingsById()", () => {
        it("returns the expected marking", async () => {
          const marking = await getMarkingById(dummyMarking.marking_id);
          expect.assertions(1);
          expect(marking).toStrictEqual(dummyMarking);
        });
      });
    });
  });
});

afterAll(async () => {
    await prisma.marking.deleteMany({where: {identifier: {startsWith: 'TEST_MARKING_'}}});
});
