import { apiError } from "../../utils/types";
import supertest from "supertest";
import { makeApp } from "../../app";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import {
  getAllCollectionUnits as _getAllCollectionUnits,
  getCollectionUnitById as _getCollectionUnitById,
  getCollectionUnitsByCritterId as _getCollectionUnitsByCritterId,
  updateCollectionUnit as _updateCollectionUnit,
  createCollectionUnit as _createCollectionUnit,
  deleteCollectionUnit as _deleteCollectionUnit,
} from "./collectionUnit.service";
import {
  CollectionUnitCreateInput,
  CollectionUnitIncludes,
  CollectionUnitResponse,
  CollectionUnitResponseSchema,
  CollectionUnitUpdateInput,
  SimpleCollectionUnitResponseSchema,
} from "./collectionUnit.utils";
import { randomUUID } from "crypto";
import { get } from "http";

// Mock CollectionUnit Objects
const ID = randomUUID();
const DATE = new Date();

const mockCollectionUnitCreateInput: CollectionUnitCreateInput = {
  critter_id: ID,
  collection_unit_id: ID,
};

const mockCollectionUnitUpdateInput: CollectionUnitUpdateInput = {
  collection_unit_id: ID,
};

const mockXrefUnit = {
  unit_name: "unit_name",
  description: "description",
};

const mockCollectionUnitIncludes: CollectionUnitIncludes = {
  critter_collection_unit_id: ID,
  critter_id: ID,
  collection_unit_id: ID,
  xref_collection_unit: mockXrefUnit,
  create_user: ID,
  update_user: ID,
  create_timestamp: DATE,
  update_timestamp: DATE,
};

const mockCollectionUnitResponse: CollectionUnitResponse = {
  critter_collection_unit_id: ID,
  critter_id: ID,
  unit_name: mockXrefUnit.unit_name,
  unit_description: mockXrefUnit.description,
  create_user: ID,
  update_user: ID,
  create_timestamp: DATE.toISOString() as unknown as Date,
  update_timestamp: DATE.toISOString() as unknown as Date,
};

const mockSimpleCollectionUnitResponse = {
  category_name: "category_name",
  unit_name: "unit_name",
  collection_unit_id: ID,
  collection_category_id: ID,
};

// Mock Prisma Calls
const create = jest
  .spyOn(prisma.critter_collection_unit, "create")
  .mockImplementation();
const upsert = jest
  .spyOn(prisma.critter_collection_unit, "upsert")
  .mockImplementation();
const findMany = jest
  .spyOn(prisma.critter_collection_unit, "findMany")
  .mockImplementation();
const findUniqueOrThrow = jest
  .spyOn(prisma.critter_collection_unit, "findUniqueOrThrow")
  .mockImplementation();
const update = jest
  .spyOn(prisma.critter_collection_unit, "update")
  .mockImplementation();
const pDelete = jest
  .spyOn(prisma.critter_collection_unit, "delete")
  .mockImplementation();
const queryRaw = jest.spyOn(prisma, "$queryRaw").mockImplementation();

// Mock Services
const getAllCollectionUnits = jest.fn();
const getCollectionUnitById = jest.fn();
const getCollectionUnitsByCritterId = jest.fn();
const updateCollectionUnit = jest.fn();
const createCollectionUnit = jest.fn();
const deleteCollectionUnit = jest.fn();
const getCritterById = jest.fn();

const request = supertest(
  makeApp({
    getAllCollectionUnits,
    getCollectionUnitById,
    getCollectionUnitsByCritterId,
    updateCollectionUnit,
    createCollectionUnit,
    deleteCollectionUnit,
    getCritterById,
  } as Record<keyof ICbDatabase, any>)
);

beforeEach(() => {
  //TODO: Reset mocked prisma calls?

  // Reset mocked services
  getAllCollectionUnits.mockReset();
  getCollectionUnitById.mockReset();
  getCollectionUnitsByCritterId.mockReset();
  updateCollectionUnit.mockReset();
  createCollectionUnit.mockReset();
  deleteCollectionUnit.mockReset();
  getCritterById.mockReset();

  // Set default returns
  // TODO
});

describe("API: CollectionUnit", () => {
  describe("ZOD SCHEMAS", () => {
    describe("SimpleCollectionUnitSchema", () => {
      it("correctly transforms extended data to simplified format", () => {
        const simpleCollectionUnit = SimpleCollectionUnitResponseSchema.parse({
          ...mockCollectionUnitIncludes,
          xref_collection_unit: {
            unit_name: mockXrefUnit.unit_name,
            collection_unit_id: ID,
            lk_collection_category: {
              category_name: "category_name",
              collection_category_id: ID,
            },
          },
        });
        expect.assertions(1);
        expect(simpleCollectionUnit).toEqual(mockSimpleCollectionUnitResponse);
      });
    });
  });

  describe("SERVICES", () => {
    describe("getAllCollectionUnits()", () => {
      it("returns an array of collection units", async () => {
        findMany.mockResolvedValue([mockCollectionUnitIncludes]);
        const collectionUnits = await _getAllCollectionUnits();
        expect.assertions(3);
        expect(prisma.critter_collection_unit.findMany).toHaveBeenCalledTimes(
          1
        );
        expect(collectionUnits).toBeInstanceOf(Array);
        expect(collectionUnits.length).toBe(1);
      });
    });

    describe("getCollectionUnitById()", () => {
      it("returns a collection unit when given a valid ID", async () => {
        findUniqueOrThrow.mockResolvedValue(mockCollectionUnitIncludes);
        const returnedCollectionUnit = await _getCollectionUnitById(ID);
        expect.assertions(2);
        expect(
          prisma.critter_collection_unit.findUniqueOrThrow
        ).toHaveBeenCalledTimes(1);
        expect(returnedCollectionUnit).toEqual(mockCollectionUnitIncludes);
      });

      it("throws error when given an invalid ID", async () => {
        findUniqueOrThrow.mockRejectedValue(new Error());
        await expect(_getCollectionUnitById(ID)).rejects.toThrow();
      });
    });

    describe("getCollectionUnitsByCritterId()", () => {
      it("returns collection units associated with the given critter ID", async () => {
        findMany.mockResolvedValue([mockCollectionUnitIncludes]);
        const collectionUnits = await _getCollectionUnitsByCritterId(ID);
        expect.assertions(3);
        expect(prisma.critter_collection_unit.findMany).toHaveBeenCalledTimes(
          1
        );
        expect(collectionUnits).toBeInstanceOf(Array);
        expect(collectionUnits.length).toBe(1);
      });
    });

    describe("updateCollectionUnit()", () => {
      it("returns a collection unit with the updated data", async () => {
        update.mockResolvedValue(mockCollectionUnitIncludes);
        const returnedCollectionUnit = await _updateCollectionUnit(
          ID,
          mockCollectionUnitUpdateInput
        );
        expect.assertions(2);
        expect(prisma.critter_collection_unit.update).toHaveBeenCalledTimes(1);
        expect(returnedCollectionUnit).toEqual(mockCollectionUnitIncludes);
      });
    });

    describe("createCollectionUnit()", () => {
      it("returns a newly created collection unit", async () => {
        create.mockResolvedValue(mockCollectionUnitIncludes);
        const returnedCollectionUnit = await _createCollectionUnit(
          mockCollectionUnitCreateInput
        );
        expect.assertions(2);
        expect(prisma.critter_collection_unit.create).toHaveBeenCalledTimes(1);
        expect(returnedCollectionUnit).toEqual(mockCollectionUnitIncludes);
      });
    });

    describe("deleteCollectionUnit()", () => {
      it("returns deleted collection unit and removes it from database", async () => {
        pDelete.mockResolvedValue(mockCollectionUnitIncludes);
        const deletedCollectionUnit = await _deleteCollectionUnit(ID);
        expect.assertions(2);
        expect(prisma.critter_collection_unit.delete).toHaveBeenCalledTimes(1);
        expect(deletedCollectionUnit).toEqual(mockCollectionUnitIncludes);
      });
    });
  });

  describe("ROUTERS", () => {
    describe("GET /api/collection-units", () => {
      it("returns an array of collection units", async () => {
        getAllCollectionUnits.mockResolvedValue([mockCollectionUnitIncludes]);
        const response = await request.get("/api/collection-units");
        expect.assertions(4);
        expect(getAllCollectionUnits.mock.calls.length).toBe(1);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toEqual([mockCollectionUnitResponse]);
      });
    });

    describe("GET /api/collection-units/:id", () => {
      it("returns a collection unit when given a valid ID", async () => {
        getCollectionUnitById.mockResolvedValue(mockCollectionUnitIncludes);
        const response = await request.get(`/api/collection-units/${ID}`);
        expect.assertions(4);
        expect(getCollectionUnitById.mock.calls.length).toBe(1);
        expect(response.status).toBe(200);
        expect(
          CollectionUnitResponseSchema.safeParse(response.body).success
        ).toBe(true);
        expect(response.body).toEqual(mockCollectionUnitResponse);
      });

      it("returns 404 when given an invalid ID", async () => {
        getCollectionUnitById.mockImplementation(() => {
          throw apiError.notFound("error");
        });
        const response = await request.get(`/api/collection-units/${ID}`);
        expect.assertions(2);
        expect(getCollectionUnitById.mock.calls.length).toBe(1);
        expect(response.status).toBe(404);
      });
    });

    describe("GET /api/collection-units/critter/:id", () => {
      it("returns collection units associated with the given critter ID", async () => {
        getCollectionUnitsByCritterId.mockResolvedValue([
          mockCollectionUnitIncludes,
        ]);
        getCritterById.mockResolvedValue({}); // Doesn't throw
        const response = await request.get(
          `/api/collection-units/critter/${ID}`
        );
        expect.assertions(4);
        expect(getCollectionUnitsByCritterId.mock.calls.length).toBe(1);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toEqual([mockCollectionUnitResponse]);
      });

      it("returns 404 when given an invalid critter ID", async () => {
        getCritterById.mockImplementation(() => {
          throw apiError.notFound("error");
        });
        const response = await request.get(
          `/api/collection-units/critter/${ID}`
        );
        expect.assertions(3);
        expect(getCritterById.mock.calls.length).toBe(1);
        expect(getCollectionUnitsByCritterId.mock.calls.length).toBe(0);
        expect(response.status).toBe(404);
      });
    });

    describe("PATCH /api/collection-units/:id", () => {
      it("returns a collection unit with the updated data", async () => {
        updateCollectionUnit.mockResolvedValue(mockCollectionUnitIncludes);
        const response = await request
          .patch(`/api/collection-units/${ID}`)
          .send(mockCollectionUnitUpdateInput);
        expect.assertions(4);
        expect(updateCollectionUnit.mock.calls.length).toBe(1);
        expect(response.status).toBe(200);
        expect(
          CollectionUnitResponseSchema.safeParse(response.body).success
        ).toBe(true);
        expect(response.body).toEqual(mockCollectionUnitResponse);
      });

      it("returns 404 when given an invalid ID", async () => {
        updateCollectionUnit.mockImplementation(() => {
          throw apiError.notFound("error");
        });
        const response = await request
          .patch(`/api/collection-units/${ID}`)
          .send(mockCollectionUnitUpdateInput);
        expect.assertions(2);
        expect(updateCollectionUnit.mock.calls.length).toBe(1);
        expect(response.status).toBe(404);
      });

      it("returns 400 when given invalid data", async () => {
        const response = await request
          .patch(`/api/collection-units/${ID}`)
          .send({ badData: "badData" });
        expect.assertions(2);
        expect(updateCollectionUnit.mock.calls.length).toBe(0); // Not called because zod catches the error
        expect(response.status).toBe(400);
      });
    });

    describe("POST /api/collection-units/create", () => {
      it("returns a newly created collection unit", async () => {
        createCollectionUnit.mockResolvedValue(mockCollectionUnitIncludes);
        const response = await request
          .post("/api/collection-units/create")
          .send(mockCollectionUnitCreateInput);
        expect.assertions(4);
        expect(createCollectionUnit.mock.calls.length).toBe(1);
        expect(response.status).toBe(201);
        expect(
          CollectionUnitResponseSchema.safeParse(response.body).success
        ).toBe(true);
        expect(response.body).toEqual(mockCollectionUnitResponse);
      });

      it("returns 400 when given invalid data", async () => {
        const response = await request
          .post("/api/collection-units/create")
          .send({ badData: "badData" });
        expect.assertions(2);
        expect(createCollectionUnit.mock.calls.length).toBe(0); // Not called because zod catches the error
        expect(response.status).toBe(400);
      });
    });

    describe("DELETE /api/collection-units/:id", () => {
      it("returns a message for deleted collection unit", async () => {
        deleteCollectionUnit.mockResolvedValue(mockCollectionUnitIncludes);
        const response = await request.delete(`/api/collection-units/${ID}`);
        expect.assertions(3);
        expect(deleteCollectionUnit.mock.calls.length).toBe(1);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(`CollectionUnit ${ID} has been deleted`);
      });

      it("returns 404 when given an invalid ID", async () => {
        deleteCollectionUnit.mockImplementation(() => {
          throw apiError.notFound("error");
        });
        const response = await request.delete(`/api/collection-units/${ID}`);
        expect.assertions(2);
        expect(deleteCollectionUnit.mock.calls.length).toBe(1);
        expect(response.status).toBe(404);
      });
    });
  });
});
