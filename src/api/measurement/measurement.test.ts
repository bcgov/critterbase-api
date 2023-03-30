import { measurement_qualitative } from "@prisma/client";
import { prisma, request } from "../../utils/constants";
import {
  QuantitativeSchema,
  QualitativeSchema,
  QuantitativeResponseSchema,
  QualitativeResponseSchema,
} from "./measurement.utils";
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
import { array } from "zod";

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
const ROUTE = "/api/measurements";

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

describe("API: Measurement", () => {
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

  describe("ROUTERS", () => {
    describe(`GET ${ROUTE}`, () => {
      it("should return status 200 ", async () => {
        const res = await request.get(ROUTE);
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
      });
      it("should return object with an array of qual / quant measurements ", async () => {
        const res = await request.get(ROUTE);
        const { quantitative, qualitative } = res.body.measurements;
        expect(quantitative).toBeInstanceOf(Array);
        expect(qualitative).toBeInstanceOf(Array);
        expect(array(QuantitativeResponseSchema).parse(quantitative));
        expect(array(QualitativeResponseSchema).parse(qualitative));
      });
    });

    // describe(`POST ${ROUTE}/create`, () => {
    //   it.todo("returns status 400 when nothing provided in body");

    //   it("returns status 201 with valid body in req", async () => {
    //     const res = await request.post(`${ROUTE}/create`).send(data);
    //     createdLocation = res.body;
    //     expect(res.status).toBe(201);
    //     expect(res.body.location_comment).toBe(COMMENT);
    //   });
    //   it("returns status 400 with property that does not pass validation", async () => {
    //     const res = await request
    //       .post(`${ROUTE}/create`)
    //       .send({ latitude: "1", location_comment: COMMENT });
    //     expect(res.status).toBe(400);
    //   });
    //   it("returns status 400 with extra property", async () => {
    //     const res = await request
    //       .post(`${ROUTE}/create`)
    //       .send({ extra_property: "extra" });
    //     expect(res.status).toBe(400);
    //   });
    // });

    // describe(`GET ${ROUTE}/:id`, () => {
    //   it("should return status 200 and a formatted location", async () => {
    //     const res = await request.get(
    //       `${ROUTE}/${createdLocation.location_id}`
    //     );
    //     expect(res.body).toBeDefined();
    //     expect(res.status).toBe(200);
    //     expect(LocationResponseSchema.safeParse(location).success);
    //   });
    //   it("with non existant id, should return status 404 and have error in body", async () => {
    //     const res = await request.get(`${ROUTE}/${BAD_ID}`);
    //     expect(res.status).toBe(404);
    //     expect(res.body.error).toBeDefined();
    //   });
    // });

    // describe(`PATCH ${ROUTE}/:id`, () => {
    //   it("returns status 201 and updates a valid field", async () => {
    //     const res = await request
    //       .patch(`${ROUTE}/${createdLocation.location_id}`)
    //       .send({ location_comment: UPDATE });
    //     createdLocation = res.body;
    //     expect(res.status).toBe(201);
    //     expect(res.body.location_comment).toBe(UPDATE);
    //   });
    //   it("returns status 400 with extra property", async () => {
    //     const res = await request
    //       .patch(`${ROUTE}/${createdLocation.location_id}`)
    //       .send({ extra_property: "false" });
    //     expect(res.status).toBe(400);
    //   });
    //   it("returns status 400 with property that does not pass validation", async () => {
    //     const res = await request
    //       .patch(`${ROUTE}/${createdLocation.location_id}`)
    //       .send({ latitude: "1" });
    //     expect(res.status).toBe(400);
    //   });
    // });

    // describe(`DELETE ${ROUTE}/:id`, () => {
    //   it("should return status 200", async () => {
    //     const res = await request.delete(
    //       `${ROUTE}/${createdLocation.location_id}`
    //     );
    //     expect(res.body).toBeDefined();
    //     expect(res.status).toBe(200);
    //   });
    //   it("with non existant id, should return status 404 and have error in body", async () => {
    //     const res = await request.delete(`${ROUTE}/${BAD_ID}`);
    //     expect(res.status).toBe(404);
    //     expect(res.body.error).toBeDefined();
    //   });
    // });
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
