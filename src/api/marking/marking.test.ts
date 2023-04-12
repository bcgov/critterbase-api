import { prisma, request } from "../../utils/constants";
import {
  createMarking,
  deleteMarking,
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
} from "./marking.service";
import { randomInt, randomUUID } from "crypto";
import {
  markingResponseSchema,
  MarkingResponseSchema,
  MarkingCreateInput,
  markingIncludes,
  MarkingIncludes,
} from "./marking.utils";

let dummyMarking: MarkingResponseSchema;
let dummyMarkingIncludes: MarkingIncludes;
let dummyMarkingInput: MarkingCreateInput;
let dummyMarkingKeys: string[];
let dummyMarkingIncludesKeys: string[];

/**
 * * Creates a new marking object that references an existing critter and marking location
 */
async function newMarking(): Promise<MarkingCreateInput> {
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
  const dummyMarking: MarkingCreateInput = {
    critter_id: dummyCritterId,
    taxon_marking_body_location_id: dummyTaxonMarkingId,
    identifier: `TEST_MARKING_${randomInt(99999999)}`,
    frequency: randomInt(99999999),
    frequency_unit: "KHz",
    attached_timestamp: new Date(randomInt(999999)),
  };
  return dummyMarking;
}

beforeAll(async () => {
  // Sets a global dummy marking to reduce complexity on similar tests
  dummyMarkingInput = await newMarking();
  dummyMarkingIncludes = await prisma.marking.create({
    data: dummyMarkingInput,
    ...markingIncludes,
  });
  dummyMarking = markingResponseSchema.parse(dummyMarkingIncludes);
  dummyMarkingKeys = Object.keys(dummyMarking);
  dummyMarkingIncludesKeys = Object.keys(dummyMarkingIncludes);
});

describe("API: Marking", () => {
  describe("ZOD SCHEMA", () => {
    describe("markingResponseSchema", () => {
      it("correctly handles null data from includes", () => {
        const formattedData = markingResponseSchema.parse({
          ...dummyMarkingIncludes,
          lk_marking_type: null,
          lk_colour_marking_text_colour_idTolk_colour: { colour: "red" },
        });
        expect(formattedData).toStrictEqual({
          ...dummyMarking,
          marking_type: null,
          text_colour: "red",
        });
      });

      it("correctly handles undefined data from includes", () => {
        const { xref_taxon_marking_body_location, ...rest } =
          dummyMarkingIncludes;
        const formattedData = markingResponseSchema.parse(rest);
        expect(formattedData).toStrictEqual({
          ...dummyMarking,
          body_location: null,
        });
      });
    });
  });

  describe("SERVICES", () => {
    describe("createMarking()", () => {
      it("creates a new marking", async () => {
        const newMarkingInput = await newMarking();
        const marking = await createMarking(newMarkingInput);
        expect.assertions(2);
        expect(marking.critter_id).toBe(newMarkingInput.critter_id);
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

      it("returns markings with correct properties", async () => {
        const markings = await getAllMarkings();
        expect.assertions(markings.length * dummyMarkingIncludesKeys.length);
        for (const marking of markings) {
          for (const key of dummyMarkingIncludesKeys) {
            expect(marking).toHaveProperty(key);
          }
        }
      });
    });

    describe("getMarkingById()", () => {
      it("returns the expected marking", async () => {
        const marking = await getMarkingById(dummyMarking.marking_id);
        expect.assertions(1);
        expect(marking).toStrictEqual(dummyMarkingIncludes);
      });
    });

    describe("getMarkingsByCritterId()", () => {
      it("returns an array of markings with the expected critter ID", async () => {
        // create another record with the same critter_id
        const markingInput = await newMarking();
        await prisma.marking.create({
          data: { ...markingInput, critter_id: dummyMarking.critter_id },
        });
        const returnedMarkings = await getMarkingsByCritterId(
          dummyMarking.critter_id
        );
        expect.assertions(1 + returnedMarkings.length);
        expect(returnedMarkings.length).toBeGreaterThanOrEqual(2); // At least two markings tied to this critter
        for (const marking of returnedMarkings) {
          expect(marking.critter_id).toBe(dummyMarking.critter_id);
        }
      });
      it("returns an empty array if no markings are found", async () => {
        const markings = await getMarkingsByCritterId(randomUUID());
        expect.assertions(2);
        expect(markings).toBeInstanceOf(Array);
        expect(markings.length).toBe(0);
      });
    });

    describe("updateMarking()", () => {
      it("updates a marking", async () => {
        const marking = await prisma.marking.create({
          data: await newMarking(),
          ...markingIncludes,
        });
        const newData = {
          identifier: `TEST_MARKING_UPDATED${randomInt(99999999)}`,
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
          ...markingIncludes,
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

  describe("ROUTERS", () => {
    describe("GET /api/markings", () => {
      it("returns status 200", async () => {
        expect.assertions(1);
        const res = await request.get("/api/markings");
        expect(res.status).toBe(200);
      });

      it("returns an array", async () => {
        expect.assertions(1);
        const res = await request.get("/api/markings");
        expect(res.body).toBeInstanceOf(Array);
      });

      it("returns markings with correct properties", async () => {
        const res = await request.get("/api/markings");
        const markings = res.body;
        expect.assertions(markings.length * dummyMarkingKeys.length);
        for (const marking of markings) {
          for (const key of dummyMarkingKeys) {
            expect(marking).toHaveProperty(key);
          }
        }
      });
    });

    describe("POST /api/markings/create", () => {
      it("returns status 201", async () => {
        const marking = await newMarking();
        const res = await request.post("/api/markings/create").send(marking);
        expect.assertions(1);
        expect(res.status).toBe(201);
      });

      it("returns a marking", async () => {
        const marking = await newMarking();
        const res = await request.post("/api/markings/create").send(marking);
        const returnedMarking = res.body;
        expect.assertions(dummyMarkingKeys.length);
        for (const key of dummyMarkingKeys) {
          expect(returnedMarking).toHaveProperty(key);
        }
      });

      it("strips invalid fields from data", async () => {
        const marking = await newMarking();
        const res = await request
          .post("/api/markings/create")
          .send({ ...marking, invalidField: "qwerty123" });
        expect.assertions(2);
        expect(res.status).toBe(201);
        expect(res.body).not.toHaveProperty("invalidField");
      });

      it("returns status 400 when data is missing required fields", async () => {
        const marking = await newMarking();
        const res = await request.post("/api/markings/create").send({
          // left out required marking taxon information
          critter_id: marking.critter_id,
          identifier: marking.identifier,
        });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/markings/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request.get(`/api/markings/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const res = await request.get(
          `/api/markings/${dummyMarking.marking_id}`
        );
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns a marking", async () => {
        const res = await request.get(
          `/api/markings/${dummyMarking.marking_id}`
        );
        expect.assertions(dummyMarkingKeys.length);
        for (const key of dummyMarkingKeys) {
          expect(res.body).toHaveProperty(key);
        }
      });
    });

    describe("PATCH /api/markings/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request
          .patch(`/api/markings/${randomUUID()}`)
          .send({ identifier: dummyMarking.identifier });
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const res = await request
          .patch(`/api/markings/${dummyMarking.marking_id}`)
          .send({ identifier: dummyMarking.identifier });
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns a marking", async () => {
        const res = await request
          .patch(`/api/markings/${dummyMarking.marking_id}`)
          .send({ identifier: dummyMarking.identifier });
        expect.assertions(dummyMarkingKeys.length);
        for (const key of dummyMarkingKeys) {
          expect(res.body).toHaveProperty(key);
        }
      });

      it("returns status 400 when data is empty", async () => {
        const res = await request.patch(
          `/api/markings/${dummyMarking.marking_id}`
        );
        expect.assertions(1);
        expect(res.status).toBe(400);
      });

      it("strips invalid fields from data", async () => {
        const res = await request
          .patch(`/api/markings/${dummyMarking.marking_id}`)
          .send({
            identifier: dummyMarking.identifier,
            invalidField: "qwerty123",
          });
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body).not.toHaveProperty("invalidField");
      });
    });

    describe("DELETE /api/markings/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request.delete(`/api/markings/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const marking = await prisma.marking.create({
          data: await newMarking(),
        });
        const res = await request.delete(`/api/markings/${marking.marking_id}`);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns marking deleted message", async () => {
        const marking = await prisma.marking.create({
          data: await newMarking(),
        });
        const res = await request.delete(`/api/markings/${marking.marking_id}`);
        expect.assertions(1);
        expect(res.body).toStrictEqual(
          `Marking ${marking.marking_id} has been deleted`
        );
      });
    });

    describe("GET /api/markings/critter/:id", () => {
      it("returns status 404 if the critter id does not exist", async () => {
        const res = await request.get(`/api/markings/critter/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const res = await request.get(
          `/api/markings/critter/${dummyMarking.critter_id}`
        );
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns an array", async () => {
        expect.assertions(1);
        const res = await request.get(
          `/api/markings/critter/${dummyMarking.critter_id}`
        );
        expect(res.body).toBeInstanceOf(Array);
      });

      it("returns markings with correct properties", async () => {
        const res = await request.get(
          `/api/markings/critter/${dummyMarking.critter_id}`
        );
        const markings = res.body;
        expect.assertions(markings.length * (dummyMarkingKeys.length + 1));
        for (const marking of markings) {
          expect(marking.critter_id).toBe(dummyMarking.critter_id);
          for (const key of dummyMarkingKeys) {
            expect(marking).toHaveProperty(key);
          }
        }
      });
    });
  });
});

afterAll(async () => {
  await prisma.marking.deleteMany({
    where: { identifier: { startsWith: "TEST_MARKING_" } },
  });
});
