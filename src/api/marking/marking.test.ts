import { randomInt, randomUUID } from "crypto";
import { markingResponseSchema } from "./marking.utils";
import { prisma } from "../../utils/constants";
import {
  createMarking as _createMarking,
  deleteMarking as _deleteMarking,
  getAllMarkings as _getAllMarkings,
  getMarkingById as _getMarkingById,
  getMarkingsByCritterId as _getMarkingsByCritterId,
  updateMarking as _updateMarking,
  appendEnglishMarkingsAsUUID as _appendEnglishMarkingsAsUUID,
} from "./marking.service";
import { makeApp } from "../../app";
import supertest from "supertest";
import { ICbDatabase } from "../../utils/database";
import {
  critter,
  lk_colour,
  marking,
  xref_taxon_marking_body_location,
} from "@prisma/client";
import { apiError } from "../../utils/types";
import * as lookups from "../lookup/lookup.service";

const createMarking = jest.fn();
const getAllMarkings = jest.fn();
const updateMarking = jest.fn();
const deleteMarking = jest.fn();
const getMarkingById = jest.fn();
const getMarkingsByCritterId = jest.fn();
const verifyMarkingsAgainstTaxon = jest.fn();
const verifyMarkingsCanBeAssignedToTsn = jest.fn();

const request = supertest(
  makeApp({
    createMarking,
    getAllMarkings,
    updateMarking,
    deleteMarking,
    getMarkingById,
    getMarkingsByCritterId,
    verifyMarkingsAgainstTaxon,
    markingService: { verifyMarkingsCanBeAssignedToTsn },
  } as unknown as ICbDatabase)
);

const create = jest.spyOn(prisma.marking, "create").mockImplementation();
const update = jest.spyOn(prisma.marking, "update").mockImplementation();
const findMany = jest.spyOn(prisma.marking, "findMany").mockImplementation();
const findUniqueOrThrow = jest
  .spyOn(prisma.marking, "findUniqueOrThrow")
  .mockImplementation();
const mDelete = jest.spyOn(prisma.marking, "delete").mockImplementation();
const critterFindUniqueOrThrow = jest
  .spyOn(prisma.critter, "findUniqueOrThrow")
  .mockImplementation();
const getColourByName = jest
  .spyOn(lookups, "getColourByName")
  .mockImplementation();
const getBodyLocationByNameAndTsn = jest
  .spyOn(lookups, "getBodyLocationByNameAndTsn")
  .mockImplementation();

const MARKING_ID = "4804d622-9539-40e6-a8a5-b7b223c2f09f";
const CRITTER_ID = "11084b96-5cbd-421e-8106-511ecfb51f7a";
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
  update_timestamp: new Date(),
};
const CRITTER: critter = {
  critter_id: CRITTER_ID,
  itis_tsn: 1,
  itis_scientific_name: "Alces",
  wlh_id: "111",
  animal_id: "A13",
  sex: "Male",
  responsible_region_nr_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
  critter_comment: "Hi :)",
};

const COLOUR: lk_colour = {
  colour_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  colour: "Red",
  hex_code: null,
  description: null,
  create_user: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  update_user: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const XREF_TAX_LOC: xref_taxon_marking_body_location = {
  taxon_marking_body_location_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  itis_tsn: 1,
  body_location: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  description: null,
  create_user: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  update_user: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

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
  });
});

describe("API: Marking", () => {
  describe("ZOD SCHEMA", () => {
    describe("markingResponseSchema", () => {
      it("correctly handles null data from includes", () => {
        expect(true).toBe(true);
        const parsed2 = markingResponseSchema.parse({
          xref_taxon_marking_body_location: { body_location: 1 },
          lk_marking_type: { name: 1 },
          lk_marking_material: { material: 1 },
          lk_colour_marking_primary_colour_idTolk_colour: { colour: 1 },
          lk_colour_marking_secondary_colour_idTolk_colour: { colour: 1 },
          lk_colour_marking_text_colour_idTolk_colour: { colour: 1 },
        });
        expect(parsed2.body_location).toBeDefined();
        expect(parsed2.marking_type).toBeDefined();
        expect(parsed2.marking_material).toBeDefined();
        expect(parsed2.primary_colour).toBeDefined();
        expect(parsed2.secondary_colour).toBeDefined();
        expect(parsed2.text_colour).toBeDefined();
      });
    });
  });

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

    describe("appendEnglishMarkingsAsUUID()", () => {
      it("should append uuids based on english marking field names", async () => {
        const body = {
          primary_colour: "Red",
          secondary_colour: "Red",
          body_location: "Left Ear",
        };
        getColourByName.mockResolvedValue(COLOUR);
        getBodyLocationByNameAndTsn.mockResolvedValue(XREF_TAX_LOC);
        const new_body = await _appendEnglishMarkingsAsUUID(body, 1);
        expect.assertions(5);
        expect(getColourByName.mock.calls.length).toBe(2);
        expect(getBodyLocationByNameAndTsn.mock.calls.length).toBe(1);
        expect(new_body).toHaveProperty("primary_colour_id");
        expect(new_body).toHaveProperty("secondary_colour_id");
        expect(new_body).toHaveProperty("taxon_marking_body_location_id");
      });
      it("should not append any extra fields", async () => {
        const body = {
          foo: "bar",
        };
        getColourByName.mockResolvedValue(COLOUR);
        getBodyLocationByNameAndTsn.mockResolvedValue(XREF_TAX_LOC);
        const new_body = await _appendEnglishMarkingsAsUUID(body, 1);
        expect.assertions(5);
        expect(getColourByName.mock.calls.length).toBe(0);
        expect(getBodyLocationByNameAndTsn.mock.calls.length).toBe(0);
        expect(new_body).not.toHaveProperty("primary_colour_id");
        expect(new_body).not.toHaveProperty("secondary_colour_id");
        expect(new_body).not.toHaveProperty("taxon_marking_body_location_id");
      });
      it("should fail to append bad english names", async () => {
        const body = {
          primary_colour: "foo",
          secondary_colour: "foo",
          body_location: "foo",
        };
        getColourByName.mockResolvedValue(null);
        getBodyLocationByNameAndTsn.mockResolvedValue(null);
        const new_body = await _appendEnglishMarkingsAsUUID(body, 1);
        expect.assertions(5);
        expect(getColourByName.mock.calls.length).toBe(2);
        expect(getBodyLocationByNameAndTsn.mock.calls.length).toBe(1);
        expect(new_body.primary_colour_id).toBeUndefined();
        expect(new_body.secondary_colour_id).toBeUndefined();
        expect(new_body.taxon_marking_body_location_id).toBeUndefined();
      });
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
        const returnedMarkings = await _getMarkingsByCritterId(CRITTER_ID);
        expect.assertions(3);
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
        update.mockResolvedValue({ ...MARKING, order: 99 });
        const updatedMarking = await _updateMarking(MARKING_ID, { order: 99 });
        expect.assertions(2);
        expect(updatedMarking.order).toBe(99);
        expect(prisma.marking.update).toHaveBeenCalled();
      });
    });

    describe("deleteMarking()", () => {
      it("deletes a marking", async () => {
        mDelete.mockResolvedValue(MARKING);
        const deletedMarking = await _deleteMarking(MARKING_ID);
        expect.assertions(2);
        expect(deletedMarking.marking_id).toBe(MARKING_ID);
        expect(prisma.marking.delete).toHaveBeenCalled();
      });
    });
  });

  describe("ROUTERS", () => {
    describe("GET /api/markings", () => {
      it("returns status 200", async () => {
        expect.assertions(3);
        const res = await request.get("/api/markings");
        expect(res.status).toBe(200);
        expect(getAllMarkings.mock.calls.length).toBe(1);
        expect(getAllMarkings.mock.results[0].value[0].marking_id).toBe(
          MARKING_ID
        );
      });
    });

    describe("POST /api/markings/verify", () => {
      it("should return status 200", async () => {
        expect.assertions(5);
        verifyMarkingsCanBeAssignedToTsn.mockResolvedValue({
          verified: false,
          invalid_markings: [MARKING.marking_id],
        });
        const res = await request.post("/api/markings/verify").send({
          itis_tsn: 1,
          markings: [{ marking_id: MARKING.marking_id }],
        });
        expect(res.status).toBe(200);
        expect(verifyMarkingsCanBeAssignedToTsn.mock.calls.length).toBe(1);
        expect(res.body.verified).toBe(false);
        expect(res.body.invalid_markings.length).toBe(1);
        expect(res.body.invalid_markings[0]).toBe(MARKING_ID);
      });
    });

    describe("POST /api/markings/create", () => {
      it("returns status 201", async () => {
        const res = await request.post("/api/markings/create").send(MARKING);
        expect.assertions(3);
        expect(res.status).toBe(201);
        expect(createMarking.mock.calls.length).toBe(1);
        expect(createMarking.mock.results[0].value.marking_id).toBe(MARKING_ID);
      });

      it("strips invalid fields from data", async () => {
        const res = await request
          .post("/api/markings/create")
          .send({ ...MARKING, invalidField: "qwerty123" });
        expect.assertions(3);
        expect(res.status).toBe(201);
        expect(createMarking.mock.calls.length).toBe(1);
        expect(res.body).not.toHaveProperty("invalidField");
      });

      it("returns status 400 when data is missing required fields", async () => {
        const res = await request.post("/api/markings/create").send({
          // left out required marking taxon information
          critter_id: CRITTER_ID,
          identifier: "010101",
        });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/markings/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        getMarkingById.mockImplementation(() => {
          throw apiError.notFound("");
        });
        const res = await request.get(`/api/markings/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const res = await request.get(`/api/markings/${MARKING_ID}`);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });
    });

    describe("PATCH /api/markings/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        updateMarking.mockImplementation(() => {
          throw apiError.notFound("");
        });
        const res = await request
          .patch(`/api/markings/${randomUUID()}`)
          .send(MARKING);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const res = await request
          .patch(`/api/markings/${MARKING_ID}`)
          .send(MARKING);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns status 400 when data is empty", async () => {
        const res = await request.patch(`/api/markings/${MARKING}`);
        expect.assertions(1);
        expect(res.status).toBe(400);
      });

      it("strips invalid fields from data", async () => {
        const res = await request.patch(`/api/markings/${MARKING_ID}`).send({
          ...MARKING,
          invalidField: "qwerty123",
        });
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body).not.toHaveProperty("invalidField");
      });
    });

    describe("DELETE /api/markings/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        deleteMarking.mockImplementation(() => {
          throw apiError.notFound("");
        });
        const res = await request.delete(`/api/markings/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns marking deleted message", async () => {
        const res = await request.delete(`/api/markings/${MARKING_ID}`);
        expect.assertions(3);
        expect(res.status).toBe(200);
        expect(deleteMarking.mock.calls.length).toBe(1);
        expect(res.body.marking_id).toBe(MARKING_ID);
      });
    });

    describe("GET /api/markings/critter/:id", () => {
      it("returns status 404 if the critter id does not exist", async () => {
        getMarkingsByCritterId.mockImplementation(() => {
          throw apiError.notFound("");
        });
        const res = await request.get(`/api/markings/critter/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        critterFindUniqueOrThrow.mockResolvedValue(CRITTER);
        const res = await request.get(`/api/markings/critter/${CRITTER_ID}`);
        expect.assertions(3);
        expect(res.status).toBe(200);
        expect(getMarkingsByCritterId.mock.calls.length).toBe(1);
        expect(getMarkingsByCritterId.mock.results[0].value[0].marking_id).toBe(
          MARKING_ID
        );
      });
    });
  });
});
