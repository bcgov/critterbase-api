import { apiError } from "../../utils/types";
import supertest from "supertest";
import { makeApp } from "../../app";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import {
  getLocationOrThrow as _getLocationOrThrow,
  getAllLocations as _getAllLocations,
  deleteLocation as _deleteLocation,
  createLocation as _createLocation,
  updateLocation as _updateLocation,
} from "./location.service";
import {
  CommonFormattedLocationSchema,
  LocationResponse,
  LocationBody,
  CommonLocationType,
  LocationResponseSchema,
} from "./location.utils";
import { randomUUID } from "crypto";
import { location } from "@prisma/client";

// Mock Location Objects
const ID = randomUUID();
const DATE = new Date();

const mockLocationBody: LocationBody = {
  latitude: 1,
  longitude: 1,
  coordinate_uncertainty: 1,
  coordinate_uncertainty_unit: "m",
  wmu_id: ID,
  region_nr_id: ID,
  region_env_id: ID,
  elevation: 1,
  temperature: 1,
  location_comment: "test",
};

const mockLocation: location = {
  location_id: ID,
  latitude: 1,
  longitude: 1,
  coordinate_uncertainty: 1,
  coordinate_uncertainty_unit: "m",
  wmu_id: ID,
  region_nr_id: ID,
  region_env_id: ID,
  elevation: 1,
  temperature: 1,
  location_comment: "test",
  create_user: ID,
  update_user: ID,
  create_timestamp: DATE,
  update_timestamp: DATE,
};

const mockCommonLocation: CommonLocationType & location = {
  ...mockLocation,
  lk_region_env: { region_env_id: ID, region_env_name: "test" },
  lk_region_nr: { region_nr_id: ID, region_nr_name: "test" },
  lk_wildlife_management_unit: { wmu_id: ID, wmu_name: "test" },
};

const mockLocationResponse: LocationResponse = {
  location_id: ID,
  latitude: 1,
  longitude: 1,
  coordinate_uncertainty: 1,
  coordinate_uncertainty_unit: "m",
  wmu_name: "test",
  region_nr_name: "test",
  region_env_name: "test",
  elevation: 1,
  temperature: 1,
  location_comment: "test",
  create_user: ID,
  update_user: ID,
  create_timestamp: DATE.toISOString() as unknown as Date,
  update_timestamp: DATE.toISOString() as unknown as Date,
};

const mockFormattedLocation = {
  latitude: 1,
  longitude: 1,
  ...mockCommonLocation.lk_region_env,
  ...mockCommonLocation.lk_region_nr,
  ...mockCommonLocation.lk_wildlife_management_unit,
};

// Mock Prisma Calls
const create = jest.spyOn(prisma.location, "create").mockImplementation();
const update = jest.spyOn(prisma.location, "update").mockImplementation();
const deleteFn = jest.spyOn(prisma.location, "delete").mockImplementation();
const findUniqueOrThrow = jest
  .spyOn(prisma.location, "findUniqueOrThrow")
  .mockImplementation();
const findMany = jest.spyOn(prisma.location, "findMany").mockImplementation();

// Mock Services
const getLocationOrThrow = jest.fn();
const getAllLocations = jest.fn();
const deleteLocation = jest.fn();
const createLocation = jest.fn();
const updateLocation = jest.fn();

const request = supertest(
  makeApp({
    getLocationOrThrow,
    getAllLocations,
    deleteLocation,
    createLocation,
    updateLocation,
  } as Record<keyof ICbDatabase, any>)
);

beforeEach(() => {
  //? Reset mocked prisma calls?

  // Reset Mocked services
  getLocationOrThrow.mockReset();
  getAllLocations.mockReset();
  deleteLocation.mockReset();
  createLocation.mockReset();
  updateLocation.mockReset();

  // TODO: set default return values for mocked services
});

// Tests
describe("API: Location", () => {
  describe("UTILS", () => {
    describe("CommonFormattedLocationSchema", () => {
      it("should return a formatted location", () => {
        expect.assertions(1);
        expect(CommonFormattedLocationSchema.parse(mockCommonLocation)).toEqual(
          mockFormattedLocation
        );
      });
      it("should return a formatted location", () => {
        const location = {
          ...mockLocation, 
          lk_region_env: null, 
          lk_region_nr: null, 
          lk_wildlife_management_unit: null
        }
        expect.assertions(1);
        expect(CommonFormattedLocationSchema.parse(location)).toEqual(
          {latitude: 1,
          longitude: 1,
          region_nr_name: undefined,
          region_env_name: undefined,
          wmu_name: undefined,
          region_nr_id: undefined,
          region_env_id: undefined,
          wmu_id: undefined}
        );
      });
    });

    describe("LocationResponseSchema", () => {
      it("should fill in null values where necessary", () => {
        expect.assertions(1);
        expect(
          LocationResponseSchema.parse({
            ...mockCommonLocation,
            create_timestamp: mockLocation.create_timestamp.toISOString(),
            update_timestamp: mockLocation.update_timestamp.toISOString(),
            lk_region_env: null,
            lk_region_nr: null,
            lk_wildlife_management_unit: null,
          })
        ).toEqual({
          ...mockLocationResponse,
          region_env_name: null,
          region_nr_name: null,
          wmu_name: null
        });
      });
    });
  });

  describe("SERVICES", () => {
    describe("getLocationOrThrow", () => {
      it("should return a location", async () => {
        findUniqueOrThrow.mockResolvedValue(mockCommonLocation);
        const location = await _getLocationOrThrow(ID);
        expect.assertions(2);
        expect(findUniqueOrThrow).toBeCalledTimes(1);
        expect(location).toEqual(mockCommonLocation);
      });

      it("should throw an error if location is not found", async () => {
        findUniqueOrThrow.mockRejectedValue(new Error());
        await expect(_getLocationOrThrow(ID)).rejects.toThrow();
      });
    });

    describe("getAllLocations", () => {
      it("should return an array of locations", async () => {
        findMany.mockResolvedValue([mockCommonLocation]);
        const locations = await _getAllLocations();
        expect.assertions(3);
        expect(findMany).toBeCalledTimes(1);
        expect(locations).toBeInstanceOf(Array);
        expect(locations).toEqual([mockCommonLocation]);
      });
    });

    describe("deleteLocation", () => {
      it("should delete a location", async () => {
        deleteFn.mockResolvedValue(mockLocation);
        const location = await _deleteLocation(ID);
        expect.assertions(2);
        expect(deleteFn).toBeCalledTimes(1);
        expect(location).toEqual(mockLocation);
      });
    });

    describe("createLocation", () => {
      it("should create a location", async () => {
        create.mockResolvedValue(mockLocation);
        const location = await _createLocation(mockLocationBody);
        expect.assertions(2);
        expect(create).toBeCalledTimes(1);
        expect(location).toEqual(mockLocation);
      });
    });

    describe("updateLocation", () => {
      it("should update a location", async () => {
        update.mockResolvedValue(mockLocation);
        const location = await _updateLocation(mockLocationBody, ID);
        expect.assertions(2);
        expect(update).toBeCalledTimes(1);
        expect(location).toEqual(mockLocation);
      });
    });
  });

  describe("ROUTERS", () => {
    describe("GET /api/locations", () => {
      it("should return an array of locations", async () => {
        getAllLocations.mockResolvedValue([mockCommonLocation]);
        const res = await request.get("/api/locations");
        expect.assertions(3);
        expect(getAllLocations).toBeCalledTimes(1);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual([mockLocationResponse]);
      });
    });
  });

  describe("GET /api/locations/:id", () => {
    it("should return a location", async () => {
      getLocationOrThrow.mockResolvedValue(mockCommonLocation);
      const res = await request.get(`/api/locations/${ID}`);
      expect.assertions(3);
      expect(getLocationOrThrow).toBeCalledTimes(1);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(mockLocationResponse);
    });

    it("should return a 404 if location is not found", async () => {
      getLocationOrThrow.mockImplementation(() => {
        throw apiError.notFound("error");
      });
      const res = await request.get(`/api/locations/${ID}`);
      expect.assertions(2);
      expect(getLocationOrThrow).toBeCalledTimes(1);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/locations/create", () => {
    it("should create a location", async () => {
      createLocation.mockResolvedValue(mockLocation);
      const res = await request
        .post(`/api/locations/create`)
        .send(mockLocationBody);
      expect.assertions(3);
      expect(createLocation).toBeCalledTimes(1);
      expect(res.status).toEqual(201);
      expect(res.body).toEqual({
        ...mockLocation,
        create_timestamp: mockLocation.create_timestamp.toISOString(),
        update_timestamp: mockLocation.update_timestamp.toISOString(),
      });
    });

    it("should return a 400 if given invalid data", async () => {
      createLocation.mockImplementation(() => {
        throw apiError.requiredProperty("error");
      });
      const res = await request
        .post(`/api/locations/create`)
        .send(mockLocationBody);
      expect.assertions(2);
      expect(createLocation).toBeCalledTimes(1);
      expect(res.status).toEqual(400);
    });
  });

  describe("PATCH /api/locations/:id", () => {
    it("should update a location", async () => {
      updateLocation.mockResolvedValue(mockLocation);
      const res = await request
        .patch(`/api/locations/${ID}`)
        .send(mockLocationBody);
      expect.assertions(3);
      expect(updateLocation).toBeCalledTimes(1);
      expect(res.status).toEqual(201);
      expect(res.body).toEqual({
        ...mockLocation,
        create_timestamp: mockLocation.create_timestamp.toISOString(),
        update_timestamp: mockLocation.update_timestamp.toISOString(),
      });
    });

    it("should return a 400 if given invalid data", async () => {
      updateLocation.mockImplementation(() => {
        throw apiError.requiredProperty("error");
      });
      const res = await request
        .patch(`/api/locations/${ID}`)
        .send(mockLocationBody);
      expect.assertions(2);
      expect(updateLocation).toBeCalledTimes(1);
      expect(res.status).toEqual(400);
    });

    it("should return a 404 if location is not found", async () => {
      updateLocation.mockImplementation(() => {
        throw apiError.notFound("error");
      });
      const res = await request
        .patch(`/api/locations/${ID}`)
        .send(mockLocationBody);
      expect.assertions(2);
      expect(updateLocation).toBeCalledTimes(1);
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/locations/:id", () => {
    it("should delete a location", async () => {
      deleteLocation.mockResolvedValue(mockLocation);
      const res = await request.delete(`/api/locations/${ID}`);
      expect.assertions(3);
      expect(deleteLocation).toBeCalledTimes(1);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(`Deleted location ${ID}`);
    });

    it("should return a 404 if location is not found", async () => {
      deleteLocation.mockImplementation(() => {
        throw apiError.notFound("error");
      });
      const res = await request.delete(`/api/locations/${ID}`);
      expect.assertions(2);
      expect(deleteLocation).toBeCalledTimes(1);
      expect(res.status).toBe(404);
    });
  });
});
