import { capture, critter, location } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma, routes } from "../../utils/constants";
import {
  createCapture as _createCapture,
  deleteCapture as _deleteCapture,
  getAllCaptures as _getAllCaptures,
  getCaptureByCritter as _getCaptureByCritter,
  getCaptureById as _getCaptureById,
  updateCapture as _updateCapture,
} from "./capture.service";
import { CaptureBodySchema, CaptureResponseSchema } from "./capture.utils";
import { makeApp } from "../../app";
import { ICbDatabase } from "../../utils/database";
import supertest from "supertest";
import { apiError } from "../../utils/types";
import { mockCommonLocation } from "../location/location.test";

const getAllCaptures = jest.fn();
const getCaptureByCritter = jest.fn();
const getCaptureById = jest.fn();
const updateCapture = jest.fn();
const deleteCapture = jest.fn();
const createCapture = jest.fn();

const request = supertest(
  makeApp({
    getAllCaptures,
    getCaptureByCritter,
    getCaptureById,
    updateCapture,
    deleteCapture,
    createCapture,
  } as Record<keyof ICbDatabase, any>)
);

const create = jest.spyOn(prisma.capture, "create").mockImplementation();
const update = jest.spyOn(prisma.capture, "update").mockImplementation();
const cdelete = jest.spyOn(prisma.capture, "delete").mockImplementation();
const findMany = jest.spyOn(prisma.capture, "findMany").mockImplementation();
const findUniqueOrThrow = jest
  .spyOn(prisma.capture, "findUniqueOrThrow")
  .mockImplementation();
const critterFindUniqueOrThrow = jest
  .spyOn(prisma.critter, "findUniqueOrThrow")
  .mockImplementation();

const CRITTER_ID = "11084b96-5cbd-421e-8106-511ecfb51f7a";
const CAPTURE_ID = "1af85263-6a7e-4b76-8ca6-118fd3c43f50";
const CAPTURE: capture = {
  capture_id: CAPTURE_ID,
  critter_id: CRITTER_ID,
  capture_location_id: null,
  release_location_id: null,
  capture_timestamp: new Date(),
  release_timestamp: null,
  capture_comment: null,
  release_comment: null,
  create_user: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  update_user: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const CRITTER: critter = {
  critter_id: CRITTER_ID,
  taxon_id: "98f9fede-95fc-4321-9444-7c2742e336fe",
  wlh_id: "12-1234",
  animal_id: "A13",
  sex: "Male",
  responsible_region_nr_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
  create_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  update_user: "1af85263-6a7e-4b76-8ca6-118fd3c43f50",
  create_timestamp: new Date(),
  update_timestamp: new Date(),
  critter_comment: "Hi :)",
};

const LOCATION = {
  latitude: 2,
  longitude: 2,
};

const CAPTURE_WITH_LOCATION = {
  ...CAPTURE,
  capture_location: LOCATION,
  release_location: LOCATION,
};

beforeEach(() => {
  getAllCaptures.mockImplementation(() => {
    return [CAPTURE];
  });
  getCaptureByCritter.mockImplementation(() => {
    return [CAPTURE];
  });
  getCaptureById.mockImplementation(() => {
    return CAPTURE;
  });
  updateCapture.mockImplementation(() => {
    return CAPTURE;
  });
  deleteCapture.mockImplementation(() => {
    return CAPTURE;
  });
  createCapture.mockImplementation(() => {
    return CAPTURE;
  });
});

describe("API: Critter", () => {
  describe("ZOD SCHEMAS", () => {
    describe("CaptureResponseSchema", () => {
      it("should parse the data correctly", async () => {
        const obj = {
          location_capture_capture_location_idTolocation: mockCommonLocation,
          location_capture_release_location_idTolocation: mockCommonLocation,
        };
        const res = CaptureResponseSchema.parse(obj);
        expect.assertions(2);
        expect(res.capture_location).not.toBeNull();
        expect(res.release_location).not.toBeNull();
      });
      it("should parse the data correctly", async () => {
        const obj = {
          location_capture_capture_location_idTolocation: null,
          location_capture_release_location_idTolocation: null,
        };
        const res = CaptureResponseSchema.parse(obj);
        expect.assertions(2);
        expect(res.capture_location).toBeNull();
        expect(res.release_location).toBeNull();
      });
    });
  });
  describe("SERVICES", () => {
    describe("creating captures", () => {
      it("should create one capture", async () => {
        create.mockResolvedValue(CAPTURE);
        const result = await _createCapture({
          ...CAPTURE,
          capture_timestamp: new Date(),
          release_timestamp: new Date(),
        });
        expect.assertions(2);
        expect(prisma.capture.create).toHaveBeenCalled();
        expect(CaptureBodySchema.safeParse(result).success).toBe(true);
      });
      it("should create one capture with included location data", async () => {
        create.mockResolvedValue(CAPTURE);
        const result = await _createCapture(CAPTURE_WITH_LOCATION);
        expect.assertions(2);
        expect(prisma.capture.create).toHaveBeenCalled();
        expect(CaptureBodySchema.safeParse(result).success).toBe(true);
      });
      it("should create one capture and connect to existing location", async () => {
        create.mockResolvedValue({
          ...CAPTURE,
          capture_location_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
          release_location_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
        });
        const result = await _createCapture({
          ...CAPTURE,
          capture_location_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
          release_location_id: "4804d622-9539-40e6-a8a5-b7b223c2f09f",
        });
        expect.assertions(4);
        expect(prisma.capture.create).toHaveBeenCalled();
        expect(CaptureBodySchema.safeParse(result).success).toBe(true);
        expect(result.capture_location_id).toBe(
          "4804d622-9539-40e6-a8a5-b7b223c2f09f"
        );
        expect(result.release_location_id).toBe(
          "4804d622-9539-40e6-a8a5-b7b223c2f09f"
        );
      });
    });
    describe("getting captures", () => {
      it("returns all captures", async () => {
        findMany.mockResolvedValue([CAPTURE]);
        const result = await _getAllCaptures();
        expect.assertions(3);
        expect(prisma.capture.findMany).toHaveBeenCalled();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(1);
      });
      it("should get one capture", async () => {
        findUniqueOrThrow.mockResolvedValue(CAPTURE);
        const result = await _getCaptureById(CAPTURE_ID);
        expect.assertions(2);
        expect(prisma.capture.findUniqueOrThrow).toHaveBeenCalled();
        expect(result?.capture_id).toBe(CAPTURE_ID);
      });
      it("should get an array of captures from critter id", async () => {
        findMany.mockResolvedValue([CAPTURE]);
        critterFindUniqueOrThrow.mockResolvedValue(CRITTER);
        const result = await _getCaptureByCritter(CRITTER_ID);
        expect.assertions(2);
        expect(prisma.capture.findMany).toHaveBeenCalled();
        expect(result?.[0].capture_id).toBe(CAPTURE_ID);
      });
    });
    describe("modifying captures", () => {
      it("modifies the capture", async () => {
        update.mockResolvedValue({ ...CAPTURE, capture_comment: "banana" });
        const result = await _updateCapture(CAPTURE_ID, {
          capture_comment: "banana",
          critter_id: "",
        });
        expect.assertions(2);
        expect(prisma.capture.update).toHaveBeenCalled();
        expect(result?.capture_comment).toBe("banana");
      });
      it("modifies capture, upserts location data", async () => {
        update.mockResolvedValue({
          ...CAPTURE,
          capture_location_id: "3572f49f-4c81-472a-8255-5d390dfdc66b",
          release_location_id: "3572f49f-4c81-472a-8255-5d390dfdc66b",
        });
        const result = await _updateCapture(CAPTURE_ID, {
          capture_location: LOCATION,
          release_location: LOCATION,
          critter_id: "",
        });
        expect.assertions(3);
        expect(result?.capture_location_id).toBe(
          "3572f49f-4c81-472a-8255-5d390dfdc66b"
        );
        expect(result?.release_location_id).toBe(
          "3572f49f-4c81-472a-8255-5d390dfdc66b"
        );
        expect(prisma.capture.update).toHaveBeenCalled();
      });
      it("modifies capture, forces creation of release data", async () => {
        update.mockResolvedValue({
          ...CAPTURE,
          capture_location_id: "3572f49f-4c81-472a-8255-5d390dfdc66b",
          release_location_id: "be8d11b4-e638-4b22-a10a-9a5bdcc1fbcc",
        });
        const result = await _updateCapture(CAPTURE_ID, {
          release_location: LOCATION,
          force_create_release: true,
          critter_id: "",
        });
        expect.assertions(2);
        expect(result?.capture_location_id).not.toBe(
          result?.release_location_id
        );
        expect(prisma.capture.update).toHaveBeenCalled();
      });

      it("deletes a capture", async () => {
        cdelete.mockResolvedValue(CAPTURE);
        const result = await _deleteCapture(CAPTURE_ID);
        expect.assertions(2);
        expect(result?.capture_id).toBe(CAPTURE_ID);
        expect(prisma.capture.delete).toHaveBeenCalled();
      });
    });
  });
  describe("ROUTERS", () => {
    describe(`POST ${routes.captures}/create`, () => {
      it("should return status 201", async () => {
        expect.assertions(3);
        const res = await request.post("/api/captures/create").send(CAPTURE);
        expect(res.status).toBe(201);
        expect(createCapture.mock.calls.length).toBe(1);
        expect(createCapture.mock.results[0].value.capture_id).toBe(CAPTURE_ID);
      });
      it("should return status 201 with included location data", async () => {
        expect.assertions(3);
        const res = await request
          .post("/api/captures/create")
          .send(CAPTURE_WITH_LOCATION);
        expect(res.status).toBe(201);
        expect(createCapture.mock.calls.length).toBe(1);
        expect(createCapture.mock.results[0].value.capture_id).toBe(CAPTURE_ID);
      });
    });
    describe(`GET ${routes.captures}`, () => {
      it("should return status 200", async () => {
        expect.assertions(4);
        const res = await request.get("/api/captures/");
        expect(getAllCaptures.mock.calls.length).toBe(1);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(1);
        expect(res.status).toBe(200);
      });
    });
    describe(`GET ${routes.captures}/:capture_id`, () => {
      it("should get one capture", async () => {
        expect.assertions(3);
        const res = await request.get("/api/captures/" + CAPTURE_ID);
        expect(getCaptureById.mock.calls.length).toBe(1);
        expect(res.body.capture_id).toBe(CAPTURE_ID);
        expect(res.status).toBe(200);
      });
      it("should 404", async () => {
        expect.assertions(1);
        getCaptureById.mockImplementation(() => {
          throw apiError.notFound("not found");
        });
        const res = await request.get("/api/captures/" + randomUUID());
        expect(res.status).toBe(404);
      });
    });
    describe(`GET ${routes.captures}/critter/:critter_id`, () => {
      it("should return status 200 with an array of captures", async () => {
        expect.assertions(3);
        const res = await request.get("/api/captures/critter/" + CRITTER_ID);
        expect(res.status).toBe(200);
        expect(getCaptureByCritter.mock.calls.length).toBe(1);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
      it("should 404 when trying to get a bad critter", async () => {
        expect.assertions(1);
        getCaptureByCritter.mockImplementation(() => {
          throw apiError.notFound("not found");
        });
        const res = await request.get("/api/captures/critter/" + randomUUID());
        expect(res.status).toBe(404);
      });
    });
    describe(`PATCH ${routes.captures}/:capture_id`, () => {
      it("should return status 200", async () => {
        expect.assertions(3);
        updateCapture.mockImplementation(() => {
          return { ...CAPTURE, capture_comment: "eee" };
        });
        const res = await request
          .patch("/api/captures/" + CAPTURE_ID)
          .send({ capture_comment: "eee" });
        expect(res.status).toBe(200);
        expect(updateCapture.mock.calls.length).toBe(1);
        expect(res.body.capture_comment).toBe("eee");
      });
      it("should 404 if the capture is not found", async () => {
        expect.assertions(1);
        updateCapture.mockImplementation(() => {
          throw apiError.notFound("not found");
        });
        const res = await request.patch("/api/captures/" + randomUUID());
        expect(res.status).toBe(404);
      });
    });
    describe(`DELETE ${routes.captures}/:capture_id`, () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.delete("/api/captures/" + CAPTURE_ID);
        expect(res.status).toBe(200);
      });
      it("should 404 if there is no capture to delete", async () => {
        expect.assertions(1);
        deleteCapture.mockImplementation(() => {
          throw apiError.notFound("not found");
        });
        const res = await request.delete("/api/captures/" + randomUUID());
        expect(res.status).toBe(404);
      });
    });
  });
});
