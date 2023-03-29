import { measurement_qualitative } from "@prisma/client";
import { prisma } from "../../utils/constants";
import { QuantitativeSchema, QualitativeSchema } from "./measurement.utils";
import {
  createQualMeasurement,
  createQuantMeasurement,
  deleteQualMeasurement,
  deleteQuantMeasurement,
  getAllQualMeasurements,
  getAllQuantMeasurements,
  getQualMeasurementOrThrow,
  getQualMeasurementsByCritterId,
  getQuantMeasurementOrThrow,
  getQuantMeasurementsByCritterId,
} from "./measurement.service";

let numMeasurements = 0;
let measurements: any;
let measurement: any;
let createdMeasurement: any;
let measurementByCritter: any;

let QnumMeasurements = 0;
let Qmeasurements: any;
let Qmeasurement: any;
let QcreatedMeasurement: any;
let QmeasurementByCritter: any;

let createData = {
  critter_id: "2",
  taxon_measurement_id: "string",
  qualitative_option_id: "string",
  measured_timestamp: "2",
};
const badID = "deadbeef-dead-dead-dead-deaddeafbeef";
const comment = "_TEST_CREATED_";

beforeAll(async () => {
  measurements = await getAllQualMeasurements();
  Qmeasurements = await getAllQuantMeasurements();
  [
    numMeasurements,
    measurement,
    measurementByCritter,
    QnumMeasurements,
    Qmeasurement,
    QmeasurementByCritter,
  ] = await Promise.all([
    prisma.measurement_qualitative.count(),
    getQualMeasurementOrThrow(measurements[0].measurement_qualitative_id),
    getQualMeasurementsByCritterId(measurements[0].critter_id),
    prisma.measurement_quantitative.count(),
    getQuantMeasurementOrThrow(Qmeasurements[0].measurement_quantitative_id),
    getQuantMeasurementsByCritterId(Qmeasurements[0].critter_id),
  ]);
  const { critter_id, taxon_measurement_id, qualitative_option_id } =
    measurement;
  createdMeasurement = await createQualMeasurement({
    critter_id,
    taxon_measurement_id,
    qualitative_option_id,
    measurement_comment: comment,
  });

  QcreatedMeasurement = await createQuantMeasurement({
    critter_id: Qmeasurement.critter_id,
    value: 2,
    taxon_measurement_id: Qmeasurement.taxon_measurement_id,
    measurement_comment: comment,
  });
});

describe("API: Location", () => {
  describe("SERVICES", () => {
    describe("measurement.service.ts", () => {
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

      describe("getAllQuantMeasurements()", () => {
        it("returns array of quantitative measurements", async () => {
          expect(Qmeasurements).toBeInstanceOf(Array);
        });
        it("first item has quantitative_measurement_id or [] returned", async () => {
          if (Qmeasurements?.length) {
            expect(Qmeasurements[0]).toHaveProperty(
              "measurement_quantitative_id"
            );
          } else {
            expect(Qmeasurements).toBe([]);
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
          expect(QualitativeSchema.safeParse(measurement).success);
        });
      });

      describe("getQuantMeasurementOrThrow()", () => {
        it("returns quantitative_measurement with valid id", () => {
          expect(Qmeasurement).not.toBeNull();
          expect(Qmeasurement).toHaveProperty("measurement_quantitative_id");
        });
        it("throws error with an id that does not exist", async () => {
          getQuantMeasurementOrThrow(badID).catch((err) =>
            expect(err).toBeDefined()
          );
        });
        it("measurement passes validation", async () => {
          expect(QuantitativeSchema.safeParse(Qmeasurement).success);
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

      describe("getQuantMeasurementsByCritterId()", () => {
        it("returns array of quantitative_measurements or empty array", () => {
          expect(QmeasurementByCritter).not.toBeNull();
          expect(Qmeasurements).toBeInstanceOf(Array);
          if (QmeasurementByCritter?.length) {
            expect(QmeasurementByCritter[0]).toHaveProperty(
              "measurement_quantitative_id"
            );
          } else {
            expect(QmeasurementByCritter).toBe([]);
          }
        });
        it("throws error with critter_id that does not exist", async () => {
          getQuantMeasurementsByCritterId(badID).catch((err) =>
            expect(err).toBeDefined()
          );
        });
      });

      describe("createQualMeasurement()", () => {
        it("should create qualitative measurement with supplied comment", () => {
          expect(createdMeasurement).toBeDefined();
          expect(createdMeasurement.measurement_comment).toBe(comment);
        });
      });

      describe("createQuantMeasurement()", () => {
        it("should create quantitative measurement with supplied comment", () => {
          expect(QcreatedMeasurement).toBeDefined();
          expect(QcreatedMeasurement.measurement_comment).toBe(comment);
        });
      });

      describe("deleteQualMeasurement()", () => {
        it("should delete qualitative measurement", async () => {
          const deleted = await deleteQualMeasurement(
            createdMeasurement.measurement_qualitative_id
          );
          expect(deleted).toBeDefined();
        });
      });

      describe("deleteQuantMeasurement()", () => {
        it("should delete quantitative measurement", async () => {
          const deleted = await deleteQuantMeasurement(
            QcreatedMeasurement.measurement_quantitative_id
          );
          expect(deleted).toBeDefined();
        });
      });
    });
  });
  describe("CLEANUP", () => {
    it("same number of initial measurements", async () => {
      await prisma.measurement_qualitative.deleteMany({
        where: {
          measurement_comment: comment,
        },
      });
      const afterTestsNumMeasurements =
        await prisma.measurement_qualitative.count();
      expect(numMeasurements).toBe(afterTestsNumMeasurements);
    });
  });
});
