import { array } from "zod";
import { prisma, request } from "../../utils/constants";
import { ResponseSchema } from "../../utils/zod_helpers";
import {
  createQualMeasurement,
  createQuantMeasurement,
  deleteQualMeasurement,
  deleteQuantMeasurement,
  getAllQualMeasurements,
  getAllQuantMeasurements,
  getMeasurementsByCritterId,
  getQualMeasurementOrThrow,
  getQualMeasurementsByCritterId,
  getQuantMeasurementOrThrow,
  getQuantMeasurementsByCritterId,
  updateQualMeasurement,
  updateQuantMeasurement,
} from "./measurement.service";
import {
  QualitativeResponseSchema,
  QualitativeSchema,
  QuantitativeResponseSchema,
  QuantitativeSchema,
} from "./measurement.utils";

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
const badID = "52cfb108-99a5-4631-8385-1b43248ac502";
const comment = "_TEST_CREATED_";
const updateComment = "UPDATE_COMMENT";
const ROUTE = "/api/measurements";
const QUANT_ROUTE = `${ROUTE}/quantitative`;
const QUAL_ROUTE = `${ROUTE}/qualitative`;

let quantData: any;
let qualData: any;

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
  qualData = {
    critter_id,
    taxon_measurement_id,
    qualitative_option_id,
    measurement_comment: comment,
  };
  quantData = {
    critter_id: Qmeasurement.critter_id,
    value: 2,
    taxon_measurement_id: Qmeasurement.taxon_measurement_id,
    measurement_comment: comment,
  };
  createdMeasurement = await createQualMeasurement(qualData);

  QcreatedMeasurement = await createQuantMeasurement(quantData);
});

describe("API: Measurement", () => {
  describe("SERVICES", () => {
    // it("testing undefined properties", () => {
    //   const TestSchema = ResponseSchema.transform((val) => {
    //     const { a, ...rest } = val as {
    //       a: { testing: number };
    //       b: number;
    //     };
    //     return {
    //       temp: a.testing ?? null,
    //       ...rest,
    //     };
    //   });
    //   expect(TestSchema.safeParse({ a: { testing: 1 } }).success);
    //   expect(TestSchema.safeParse({ a: {} }).success);

    //   const parsed = TestSchema.parse({ a: {}, b: 1, c: 2 });
    //   expect(parsed.b).toBe(1);
    //   expect(parsed.temp).toBeNull();
    //   console.log(parsed);
    // });
    describe("measurement.service.ts", () => {
      describe(getAllQualMeasurements.name, () => {
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

      describe(getAllQuantMeasurements.name, () => {
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

      describe(getQualMeasurementOrThrow.name, () => {
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

      describe(getQuantMeasurementOrThrow.name, () => {
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

      describe(getQualMeasurementsByCritterId.name, () => {
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

      describe(getQuantMeasurementsByCritterId.name, () => {
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

      describe(getMeasurementsByCritterId.name, () => {
        it("returns array of Measurements ", async () => {
          const measurements = await getMeasurementsByCritterId(
            Qmeasurement.critter_id
          );
          const { quantitative, qualitative } = measurements;
          expect(quantitative).toBeInstanceOf(Array);
          expect(qualitative).toBeInstanceOf(Array);
          if (quantitative.length) {
            expect(quantitative[0]).toHaveProperty(
              "measurement_quantitative_id"
            );
          } else {
            expect(quantitative.length).toBe(0);
          }
          if (qualitative.length) {
            expect(qualitative[0]).toHaveProperty("measurement_qualitative_id");
          } else {
            expect(qualitative.length).toBe(0);
          }
        });
        it("throws error with critter_id that does not exist", async () => {
          getQuantMeasurementsByCritterId(badID).catch((err) =>
            expect(err).toBeDefined()
          );
        });
      });

      describe(createQualMeasurement.name, () => {
        it("should create qualitative measurement with supplied comment", () => {
          expect(createdMeasurement).toBeDefined();
          expect(createdMeasurement.measurement_comment).toBe(comment);
        });
      });

      describe(updateQualMeasurement.name, () => {
        it("should update qualitative measurement with the new supplied comment", async () => {
          const updated = await updateQualMeasurement(
            createdMeasurement.measurement_qualitative_id,
            { measurement_comment: updateComment }
          );
          expect(updated.measurement_comment).toBe(updateComment);
          expect(updated).toBeDefined();
        });
      });

      describe(updateQuantMeasurement.name, () => {
        it("should update quantitative measurement with the new supplied comment", async () => {
          const updated = await updateQuantMeasurement(
            QcreatedMeasurement.measurement_quantitative_id,
            { measurement_comment: updateComment }
          );
          expect(updated.measurement_comment).toBe(updateComment);
          expect(updated).toBeDefined();
        });
      });

      describe(createQuantMeasurement.name, () => {
        it("should create quantitative measurement with supplied comment", () => {
          expect(QcreatedMeasurement).toBeDefined();
          expect(QcreatedMeasurement.measurement_comment).toBe(comment);
        });
      });

      describe(deleteQualMeasurement.name, () => {
        it("should delete qualitative measurement", async () => {
          const deleted = await deleteQualMeasurement(
            createdMeasurement.measurement_qualitative_id
          );
          expect(deleted).toBeDefined();
        });
      });

      describe(deleteQuantMeasurement.name, () => {
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

    describe(`POST ${QUANT_ROUTE}/create`, () => {
      it.todo("returns status 400 when nothing provided in body");

      it("returns status 201 with valid body in req", async () => {
        const res = await request.post(`${QUANT_ROUTE}/create`).send(quantData);
        expect(res.status).toBe(201);
        expect(res.body.measurement_comment).toBe(comment);
        Qmeasurement = res.body;
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .post(`${QUANT_ROUTE}/create`)
          .send({ ...quantData, value: "3" });
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .post(`${QUANT_ROUTE}/create`)
          .send({ extra_property: "extra" });
        expect(res.status).toBe(400);
      });
    });

    describe(`POST ${QUAL_ROUTE}/create`, () => {
      it.todo("returns status 400 when nothing provided in body");

      it("returns status 201 with valid body in req", async () => {
        const res = await request.post(`${QUAL_ROUTE}/create`).send(qualData);
        expect(res.status).toBe(201);
        expect(res.body.measurement_comment).toBe(comment);
        measurement = res.body;
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .post(`${QUAL_ROUTE}/create`)
          .send({ ...qualData, critter_id: 1 });
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .post(`${QUAL_ROUTE}/create`)
          .send({ extra_property: "extra" });
        expect(res.status).toBe(400);
      });
    });

    describe(`PATCH ${QUAL_ROUTE}/:id`, () => {
      it("returns status 400 when nothing provided in body", async () => {
        const res = await request
          .patch(`${QUAL_ROUTE}/${measurement.measurement_qualitative_id}`)
          .send({});
        expect(res.status).toBe(400);
      });

      it("returns status 201 with valid body in req", async () => {
        const res = await request
          .patch(`${QUAL_ROUTE}/${measurement.measurement_qualitative_id}`)
          .send({ measurement_comment: updateComment });
        expect(res.status).toBe(201);
        expect(res.body.measurement_comment).toBe(updateComment);
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .post(`${QUAL_ROUTE}/create`)
          .send({ ...qualData, critter_id: 1 });
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .post(`${QUAL_ROUTE}/create`)
          .send({ extra_property: "extra" });
        expect(res.status).toBe(400);
      });
    });

    describe(`PATCH ${QUANT_ROUTE}/:id`, () => {
      it("returns status 400 when nothing provided in body", async () => {
        const res = await request
          .patch(`${QUANT_ROUTE}/${Qmeasurement.measurement_qualitative_id}`)
          .send({});
        expect(res.status).toBe(400);
      });

      it("returns status 201 with valid body in req", async () => {
        const res = await request
          .patch(`${QUANT_ROUTE}/${Qmeasurement.measurement_quantitative_id}`)
          .send({ measurement_comment: updateComment });
        expect(res.status).toBe(201);
        expect(res.body.measurement_comment).toBe(updateComment);
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .post(`${QUANT_ROUTE}/create`)
          .send({ ...qualData, critter_id: 1 });
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .post(`${QUANT_ROUTE}/create`)
          .send({ extra_property: "extra" });
        expect(res.status).toBe(400);
      });
    });

    describe(`GET ${QUANT_ROUTE}/:id`, () => {
      it("should return status 200 and a formatted quant measurement", async () => {
        const res = await request.get(
          `${QUANT_ROUTE}/${Qmeasurement.measurement_quantitative_id}`
        );
        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);
        expect(QuantitativeResponseSchema.safeParse(res.body).success);
        expect(res.body.measurement_name).toBeDefined();
      });
      it("with non existant id, should return status 404 and have error in body", async () => {
        const res = await request.get(`${QUANT_ROUTE}/${badID}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
      });
    });

    describe(`GET ${QUAL_ROUTE}/:id`, () => {
      it("should return status 200 and a formatted qual measurement", async () => {
        const res = await request.get(
          `${QUAL_ROUTE}/${measurement.measurement_qualitative_id}`
        );
        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);
        expect(QualitativeResponseSchema.safeParse(res.body).success);
        expect(res.body.option_value).toBeDefined();
      });
      it("with non existant id, should return status 404 and have error in body", async () => {
        const res = await request.get(`${QUAL_ROUTE}/${badID}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
      });
    });

    describe(`DELETE ${QUANT_ROUTE}/:id`, () => {
      it("should return status 200", async () => {
        const res = await request.delete(
          `${QUANT_ROUTE}/${Qmeasurement.measurement_quantitative_id}`
        );
        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);
      });
      it("with non existant id, should return status 404 and have error in body", async () => {
        const res = await request.delete(`${QUANT_ROUTE}/${badID}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
      });
    });
    describe(`DELETE ${QUAL_ROUTE}/:id`, () => {
      it("should return status 200", async () => {
        const res = await request.delete(
          `${QUAL_ROUTE}/${measurement.measurement_qualitative_id}`
        );
        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);
      });
      it("with non existant id, should return status 404 and have error in body", async () => {
        const res = await request.delete(`${QUAL_ROUTE}/${badID}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
      });
    });
  });

  describe("CLEANUP", () => {
    it("same number of initial measurements", async () => {
      await prisma.measurement_qualitative.deleteMany({
        where: {
          OR: [
            {
              measurement_comment: comment,
            },
            {
              measurement_comment: updateComment,
            },
          ],
        },
      });
      await prisma.measurement_quantitative.deleteMany({
        where: {
          OR: [
            {
              measurement_comment: comment,
            },
            {
              measurement_comment: updateComment,
            },
          ],
        },
      });
      const afterTestsNumMeasurements =
        await prisma.measurement_qualitative.count();
      const afterTestsNumQMeasurements =
        await prisma.measurement_quantitative.count();
      expect(numMeasurements).toBe(afterTestsNumMeasurements);
      expect(QnumMeasurements).toBe(afterTestsNumQMeasurements);
    });
  });
});
