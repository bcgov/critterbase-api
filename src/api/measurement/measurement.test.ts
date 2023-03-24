import { measurement_qualitative } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { QualitativeBodySchema } from "./measurement.types";
import {
  createQualMeasurement,
  getAllQualMeasurements,
  getQualMeasurementOrThrow,
  getQualMeasurementsByCritterId,
} from "./qualitative.service";

let numMeasurements = 0;
let measurements: any;
let measurement: any;
let createdMeasurement: any;
let measurementByCritter: any;

let createData = {
  critter_id: "2",
  taxon_measurement_id: "string",
  qualitative_option_id: "string",
  measured_timestamp: "2",
};
const badID = "deadbeef-dead-dead-dead-deaddeafbeef";

beforeAll(async () => {
  [measurements, numMeasurements] = await Promise.all([
    getAllQualMeasurements(),
    prisma.measurement_qualitative.count(),
  ]);
  [measurement, measurementByCritter] = await Promise.all([
    getQualMeasurementOrThrow(measurements[0].measurement_qualitative_id),
    getQualMeasurementsByCritterId(measurements[0].critter_id),
  ]);
});

describe("API: Location", () => {
  describe("SERVICES", () => {
    describe("qualitative.service.ts", () => {
      describe("getAllQualMeasurements()", () => {
        it("returns array of qualitative measurements", async () => {
          expect(measurements).toBeInstanceOf(Array);
        });
        it("first item has qualitative_measurement_id or [] returned", async () => {
          if (measurements?.length) {
            expect(measurements[0]).toHaveProperty(
              "measurement_qualitative_id"
            );
          } else {
            expect(measurements).toBe([]);
          }
        });
      });
      describe("getQualMeasurementOrThrow()", () => {
        it("returns qualitative_measurement with valid id", () => {
          expect(measurement).not.toBeNull();
          expect(measurement).toHaveProperty("measurement_qualitative_id");
        });
        it("throws error with an id that does not exist", async () => {
          getQualMeasurementOrThrow(badID).catch((err) =>
            expect(err).toBeDefined()
          );
        });
        it("measurement passes validation", async () => {
          expect(QualitativeBodySchema.safeParse(measurement).success);
        });
      });
      describe("getQualMeasurementsByCritterId()", () => {
        it("returns array of qualitative_measurements or empty array", () => {
          expect(measurementByCritter).not.toBeNull();
          expect(measurements).toBeInstanceOf(Array);
          if (measurementByCritter?.length) {
            expect(measurementByCritter[0]).toHaveProperty(
              "measurement_qualitative_id"
            );
          } else {
            expect(measurementByCritter).toBe([]);
          }
        });
        it("throws error with critter_id that does not exist", async () => {
          getQualMeasurementsByCritterId(badID).catch((err) =>
            expect(err).toBeDefined()
          );
        });
      });
      describe("createQualMeasurement()", async () => {
        const { critter_id, taxon_measurement_id, qualitative_option_id } =
          measurement;
        const created = await createQualMeasurement({
          critter_id,
          taxon_measurement_id,
          qualitative_option_id,
        });
      });
    });
  });
  describe("CLEANUP", () => {
    it("same number of initial measurements", async () => {
      const afterTestsNumMeasurements =
        await prisma.measurement_qualitative.count();
      expect(numMeasurements).toBe(afterTestsNumMeasurements);
    });
  });
});
