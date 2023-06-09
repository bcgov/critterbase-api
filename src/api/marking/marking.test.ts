import { randomInt, randomUUID } from "crypto";
import { prisma } from "../../utils/constants";
import {
  createMarking as _createMarking,
  deleteMarking as _deleteMarking,
  getAllMarkings as _getAllMarkings,
  getMarkingById as _getMarkingById,
  getMarkingsByCritterId as _getMarkingsByCritterId,
  updateMarking as _updateMarking,
} from "./marking.service";
import {
  MarkingCreateInput,
  MarkingIncludes,
  markingResponseSchema,
  markingIncludes
} from "./marking.utils";
import { makeApp } from "../../app";
import supertest from "supertest";
import { ICbDatabase } from "../../utils/database";
import { marking } from "@prisma/client";

const createMarking = jest.fn();
const getAllMarkings = jest.fn();
const updateMarking = jest.fn();
const deleteMarking = jest.fn();
const getMarkingById = jest.fn();
const getMarkingsByCritterId = jest.fn();

const request = supertest(
  makeApp({
    createMarking,
    getAllMarkings,
    updateMarking,
    deleteMarking,
    getMarkingById,
    getMarkingsByCritterId
  } as Record<keyof ICbDatabase, any>)
)

const create = jest.spyOn(prisma.marking, "create").mockImplementation();
const update = jest.spyOn(prisma.marking, "update").mockImplementation();
const findMany = jest.spyOn(prisma.marking, "findMany").mockImplementation();
const findUniqueOrThrow = jest.spyOn(prisma.marking, "findUniqueOrThrow").mockImplementation();
const mDelete = jest.spyOn(prisma.marking, "delete").mockImplementation();

const MARKING_ID = '4804d622-9539-40e6-a8a5-b7b223c2f09f';
const CRITTER_ID = '11084b96-5cbd-421e-8106-511ecfb51f7a';
const MARKING: marking = {
  marking_id: MARKING_ID,
  critter_id: CRITTER_ID,
  capture_id: null,
  mortality_id: null,
  taxon_marking_body_location_id: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  marking_type_id: null,
  marking_material_id: null,
  primary_colour_id: null,
  secondary_colour_id: null,
  text_colour_id: null,
  identifier: null,
  frequency: null,
  frequency_unit: null,
  order: null,
  comment: null,
  attached_timestamp: new Date(),
  removed_timestamp: null,
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date()
}


beforeEach(() => {
  createMarking.mockImplementation(() => {
    return MARKING;
  });

  updateMarking.mockImplementation(() => {
    return MARKING;
  });

  getMarkingsByCritterId.mockImplementation(() => {
    return [MARKING];
  });

  deleteMarking.mockImplementation(() => {
    return MARKING;
  });

  getMarkingById.mockImplementation(() => {
    return MARKING;
  });

  getAllMarkings.mockImplementation(() => {
    return [MARKING];
  })
})

describe("API: Marking", () => {
 /* describe("ZOD SCHEMA", () => {
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
  });*/

  describe("SERVICES", () => {
    describe("createMarking()", () => {
      it("creates a new marking", async () => {
        create.mockResolvedValue(MARKING);
        const marking = await _createMarking(MARKING);
        expect.assertions(2);
        expect(prisma.marking.create).toHaveBeenCalled();
        expect(marking.critter_id).toBe(MARKING.critter_id);
      });
    });

    describe("getAllMarkings()", () => {
      it("returns an array of markings", async () => {
        findMany.mockResolvedValue([MARKING]);
        const markings = await _getAllMarkings();
        expect.assertions(3);
        expect(prisma.marking.findMany).toHaveBeenCalled();
        expect(markings).toBeInstanceOf(Array);
        expect(markings.length).toBeGreaterThan(0);
      });

      /*it("returns markings with correct properties", async () => {
        const markings = await _getAllMarkings();
        expect.assertions(markings.length * dummyMarkingIncludesKeys.length);
        for (const marking of markings) {
          for (const key of dummyMarkingIncludesKeys) {
            expect(marking).toHaveProperty(key);
          }
        }
      });*/
    });

    describe("getMarkingById()", () => {
      it("returns the expected marking", async () => {
        findUniqueOrThrow.mockResolvedValue(MARKING);
        const marking = await _getMarkingById(MARKING_ID);
        expect.assertions(2);
        expect(prisma.marking.findUniqueOrThrow).toHaveBeenCalled();
        expect(marking.marking_id).toBe(MARKING_ID);
      });
    });

    describe("getMarkingsByCritterId()", () => {
      it("returns an array of markings with the expected critter ID", async () => {
        // create another record with the same critter_id
        findMany.mockResolvedValue([MARKING]);
        const returnedMarkings = await _getMarkingsByCritterId(
          CRITTER_ID
        );
        expect.assertions(2);
        expect(prisma.marking.findMany).toHaveBeenCalled();
        expect(returnedMarkings).toBeInstanceOf(Array);
        expect(returnedMarkings.length).toBe(1);

      });
      it("returns an empty array if no markings are found", async () => {
        findMany.mockResolvedValue([]);
        const markings = await _getMarkingsByCritterId(randomUUID());
        expect.assertions(2);
        expect(markings).toBeInstanceOf(Array);
        expect(markings.length).toBe(0);
      });
    });

    describe("updateMarking()", () => {
      it("updates a marking", async () => {
        update.mockResolvedValue({...MARKING, order: 99})
        const updatedMarking = await _updateMarking(MARKING_ID, {critter_id: CRITTER_ID, order: 99});
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
          .send(dummyMarkingInput);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const res = await request
          .patch(`/api/markings/${dummyMarking.marking_id}`)
          .send(dummyMarkingInput);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns a marking", async () => {
        const res = await request
          .patch(`/api/markings/${dummyMarking.marking_id}`)
          .send(dummyMarkingInput);
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
            ...dummyMarkingInput,
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
