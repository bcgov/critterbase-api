import { array } from "zod";
import { prisma } from "../../utils/constants";
import { makeApp } from "../../app";
import { ResponseSchema } from "../../utils/zod_helpers";
import * as helpers from "../../utils/helper_functions";
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
  verifyQualitativeMeasurementsAgainstTaxon,
  verifyQuantitativeMeasurementsAgainstTaxon,
} from "./measurement.service";
import {
  QualitativeResponseSchema,
  QualitativeSchema,
  QuantitativeResponseSchema,
  QuantitativeSchema,
} from "./measurement.utils";
import { ICbDatabase } from "../../utils/database";
import supertest from "supertest";
import {
  measurement_qualitative,
  measurement_quantitative,
} from "@prisma/client";
import { apiError } from "../../utils/types";
import { prisMock } from "../../utils/helper_functions";

const badID = "52cfb108-99a5-4631-8385-1b43248ac502";
const ID = "52cfb108-99a5-4631-8385-1b43248ac502";
const comment = "TEST";
const updateComment = "UPDATE_COMMENT";
const ROUTE = "/api/measurements";
const QUANT_ROUTE = `${ROUTE}/quantitative`;
const QUAL_ROUTE = `${ROUTE}/qualitative`;

const qualData = {
  critter_id: ID,
  taxon_measurement_id: ID,
  qualitative_option_id: ID,
  measurement_comment: comment,
};
const quantData = {
  critter_id: ID,
  value: 2,
  taxon_measurement_id: ID,
  measurement_comment: comment,
};
const quantMeasurement: measurement_quantitative = {
  measurement_quantitative_id: ID,
  critter_id: ID,
  taxon_measurement_id: ID,
  capture_id: null,
  mortality_id: null,
  value: 0,
  measurement_comment: null,
  measured_timestamp: null,
  create_user: ID,
  update_user: ID,
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};
const qualMeasurement: measurement_qualitative = {
  measurement_qualitative_id: ID,
  critter_id: ID,
  taxon_measurement_id: ID,
  capture_id: null,
  mortality_id: null,
  qualitative_option_id: ID,
  measurement_comment: null,
  measured_timestamp: null,
  create_user: ID,
  update_user: ID,
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const mockDB = {
  getAllQualMeasurements: jest.fn().mockResolvedValue([true]),
  getAllQuantMeasurements: jest.fn().mockResolvedValue([true]),
  createQualMeasurement: jest.fn().mockResolvedValue(true),
  createQuantMeasurement: jest.fn().mockResolvedValue(true),
  getQualMeasurementOrThrow: jest.fn().mockResolvedValue(qualMeasurement),
  deleteQualMeasurement: jest.fn().mockResolvedValue(true),
  getQuantMeasurementOrThrow: jest.fn().mockResolvedValue(quantMeasurement),
  deleteQuantMeasurement: jest.fn().mockResolvedValue(true),
  updateQuantMeasurement: jest.fn().mockResolvedValue(true),
  updateQualMeasurement: jest.fn().mockResolvedValue(true),
  verifyQualitativeMeasurementsAgainstTaxon: jest.fn().mockResolvedValue([]),
  verifyQuantitativeMeasurementsAgainstTaxon: jest.fn().mockResolvedValue([]),
};
const request = supertest(makeApp(mockDB as any));

describe("API: Measurement", () => {
  describe("ROUTERS", () => {
    describe(`GET ${ROUTE}`, () => {
      it("should return status 200 ", async () => {
        const res = await request.get(ROUTE);
        expect(res.status).toBe(200);
        expect(res.body.measurements).toBeDefined();
        expect(mockDB.getAllQuantMeasurements.mock.calls.length).toBe(1);
        expect(mockDB.getAllQualMeasurements.mock.calls.length).toBe(1);
      });
      it("should return object with an array of qual / quant measurements ", async () => {
        const res = await request.get(ROUTE);
        const { quantitative, qualitative } = res.body.measurements;
        expect(quantitative).toBeInstanceOf(Array);
        expect(qualitative).toBeInstanceOf(Array);
        expect(mockDB.getAllQuantMeasurements.mock.calls.length).toBe(1);
        expect(mockDB.getAllQualMeasurements.mock.calls.length).toBe(1);
      });
    });

    describe(`POST ${QUANT_ROUTE}/create`, () => {
      it("returns status 201 with valid body in req", async () => {
        const res = await request.post(`${QUANT_ROUTE}/create`).send(quantData);
        expect(res.status).toBe(201);
        expect(res.body);
        expect(mockDB.createQuantMeasurement.mock.calls.length).toBe(1);
        expect(mockDB.createQuantMeasurement.mock.calls[0][0]).toEqual(
          quantData,
        );
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .post(`${QUANT_ROUTE}/create`)
          .send({ ...quantData, value: "3" });
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
        expect(mockDB.createQuantMeasurement.mock.calls.length).toBe(0);
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .post(`${QUANT_ROUTE}/create`)
          .send({ extra_property: "extra" });
        expect(res.status).toBe(400);
        expect(mockDB.createQuantMeasurement.mock.calls.length).toBe(0);
      });
    });

    describe(`POST ${QUAL_ROUTE}/create`, () => {
      it("returns status 201 with valid body in req", async () => {
        const res = await request.post(`${QUAL_ROUTE}/create`).send(qualData);
        expect(res.status).toBe(201);
        expect(res.body);
        expect(mockDB.createQualMeasurement.mock.calls[0][0]).toEqual(qualData);
        expect(mockDB.createQualMeasurement.mock.calls.length).toBe(1);
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .post(`${QUAL_ROUTE}/create`)
          .send({ ...qualData, critter_id: 1 });
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
        expect(mockDB.createQualMeasurement.mock.calls.length).toBe(0);
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .post(`${QUAL_ROUTE}/create`)
          .send({ extra_property: "extra" });
        expect(res.status).toBe(400);
        expect(mockDB.createQualMeasurement.mock.calls.length).toBe(0);
      });
    });

    describe(`PATCH ${QUAL_ROUTE}/:id`, () => {
      it("returns status 201 with valid body in req", async () => {
        const data = { measurement_comment: updateComment };
        const res = await request.patch(`${QUAL_ROUTE}/${ID}`).send(data);
        expect(res.status).toBe(201);
        expect(mockDB.updateQualMeasurement.mock.calls.length).toBe(1);
        expect(mockDB.updateQualMeasurement.mock.calls[0][0]).toBe(ID);
        expect(mockDB.updateQualMeasurement.mock.calls[0][1]).toEqual(data);
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .post(`${QUAL_ROUTE}/create`)
          .send({ ...qualData, critter_id: 1 });
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
        expect(mockDB.updateQualMeasurement.mock.calls.length).toBe(0);
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .post(`${QUAL_ROUTE}/create`)
          .send({ extra_property: "extra" });
        expect(res.status).toBe(400);
        expect(mockDB.updateQualMeasurement.mock.calls.length).toBe(0);
      });
    });

    describe(`PATCH ${QUANT_ROUTE}/:id`, () => {
      it("returns status 201 with valid body in req", async () => {
        const res = await request
          .patch(`${QUANT_ROUTE}/${ID}`)
          .send({ measurement_comment: updateComment });
        expect(res.status).toBe(201);
        expect(res.body);
        expect(mockDB.updateQuantMeasurement.mock.calls.length).toBe(1);
        expect(mockDB.updateQuantMeasurement.mock.calls[0][0]).toBeDefined();
      });
      it("returns status 400 with property that does not pass validation", async () => {
        const res = await request
          .post(`${QUANT_ROUTE}/create`)
          .send({ ...qualData, critter_id: 1 });
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
        expect(mockDB.updateQuantMeasurement.mock.calls.length).toBe(0);
      });
      it("returns status 400 with extra property", async () => {
        const res = await request
          .post(`${QUANT_ROUTE}/create`)
          .send({ extra_property: "extra" });
        expect(res.status).toBe(400);
        expect(mockDB.updateQuantMeasurement.mock.calls.length).toBe(0);
      });
    });

    describe(`GET ${QUANT_ROUTE}/:id`, () => {
      it("should return status 200 and a formatted quant measurement", async () => {
        const res = await request.get(`${QUANT_ROUTE}/${ID}`);
        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);

        expect(mockDB.getQuantMeasurementOrThrow.mock.calls.length).toBe(1);
        expect(mockDB.getQuantMeasurementOrThrow.mock.calls[0][0]).toBe(ID);
      });
      it("with non existant id, should return status 404 and have error in body", async () => {
        mockDB.getQuantMeasurementOrThrow.mockRejectedValue(
          apiError.notFound("BAD"),
        );
        const res = await request.get(`${QUANT_ROUTE}/${ID}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
        expect(mockDB.getQuantMeasurementOrThrow.mock.calls[0][0]).toBe(ID);
        expect(mockDB.getQuantMeasurementOrThrow.mock.calls.length).toBe(1);
      });
    });

    describe(`GET ${QUAL_ROUTE}/:id`, () => {
      it("should return status 200 and a formatted qual measurement", async () => {
        const res = await request.get(`${QUAL_ROUTE}/${ID}`);
        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);
        expect(QualitativeResponseSchema.safeParse(res.body).success);
        expect(res.body.option_value).toBeDefined();

        expect(mockDB.getQualMeasurementOrThrow.mock.calls[0][0]).toBe(ID);
      });
      it("with non existant id, should return status 404 and have error in body", async () => {
        mockDB.getQualMeasurementOrThrow.mockRejectedValue(
          apiError.notFound("BAD"),
        );
        const res = await request.get(`${QUAL_ROUTE}/${ID}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
        expect(mockDB.getQualMeasurementOrThrow.mock.calls[0][0]).toBe(ID);
        expect(mockDB.getQualMeasurementOrThrow.mock.calls.length).toBe(1);
      });
    });

    describe(`DELETE ${QUANT_ROUTE}/:id`, () => {
      it("should return status 200", async () => {
        const res = await request.delete(`${QUANT_ROUTE}/${ID}`);
        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);
        expect(mockDB.deleteQuantMeasurement.mock.calls[0][0]).toBe(ID);
        expect(mockDB.deleteQuantMeasurement.mock.calls.length).toBe(1);
      });
      it("with non existant id, should return status 404 and have error in body", async () => {
        mockDB.deleteQuantMeasurement.mockRejectedValue(
          apiError.notFound("BAD"),
        );
        const res = await request.delete(`${QUANT_ROUTE}/${badID}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
        expect(mockDB.deleteQuantMeasurement.mock.calls[0][0]).toBe(ID);
      });
    });
    describe(`DELETE ${QUAL_ROUTE}/:id`, () => {
      it("should return status 200", async () => {
        const res = await request.delete(`${QUAL_ROUTE}/${ID}`);
        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);
        expect(mockDB.deleteQualMeasurement.mock.calls[0][0]).toBe(ID);
      });
      it("with non existant id, should return status 404 and have error in body", async () => {
        mockDB.deleteQualMeasurement.mockRejectedValue(
          apiError.notFound("BAD"),
        );
        const res = await request.delete(`${QUAL_ROUTE}/${ID}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
        expect(mockDB.deleteQualMeasurement.mock.calls[0][0]).toBe(ID);
      });
    });
  });
  describe("SERVICES", () => {
    describe("measurement.service.ts", () => {
      const a = jest
        .spyOn(helpers, "getParentTaxonIds")
        .mockImplementation()
        .mockResolvedValue([ID]);
      describe(verifyQuantitativeMeasurementsAgainstTaxon.name, () => {
        it("should return no problem ids if measurement taxon id is in parent ids", async () => {
          const b = prisMock("measurement_quantitative", "findMany", [
            { xref_taxon_measurement_quantitative: { taxon_id: ID } },
          ]);
          const data = await verifyQuantitativeMeasurementsAgainstTaxon(ID, []);
          expect(a.mock.calls.length).toBe(1);
          expect(a.mock.calls[0][0]).toBe(ID);
          expect(b.mock.calls.length).toBe(1);
          //No problem ids means passes validation
          expect(data.length).toBe(0);
        });
        it("should return array of problem ids if measurement taxon id is not in parent ids", async () => {
          const b = prisMock("measurement_quantitative", "findMany", [
            {
              xref_taxon_measurement_quantitative: { taxon_id: "BAD-ID" },
              measurement_quantitative_id: "GOOD-ID",
            },
          ]);
          const data = await verifyQuantitativeMeasurementsAgainstTaxon(ID, []);
          expect(a.mock.calls.length).toBe(1);
          expect(a.mock.calls[0][0]).toBe(ID);
          expect(b.mock.calls.length).toBe(1);
          //No problem ids means passes validation
          expect(data.length).toBe(1);
          expect(data[0]).toBe("GOOD-ID");
        });
      });
      describe(getAllQualMeasurements.name, () => {
        it("should return array of qual measurements", async () => {
          const p = prisMock("measurement_qualitative", "findMany", [true]);
          const res = await getAllQualMeasurements();
          expect(res[0]).toBe(true);
          expect(p.mock.calls.length).toBe(1);
        });
      });
      describe(getAllQuantMeasurements.name, () => {
        it("should return array of quant measurements", async () => {
          const p = prisMock("measurement_quantitative", "findMany", [true]);
          const res = await getAllQuantMeasurements();
          expect(res[0]).toBe(true);
          expect(p.mock.calls.length).toBe(1);
        });
      });
      describe(getQuantMeasurementOrThrow.name, () => {
        it("should return a quant measurement", async () => {
          const p = prisMock(
            "measurement_quantitative",
            "findUniqueOrThrow",
            true,
          );
          const res = await getQuantMeasurementOrThrow(ID);
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toBeDefined();
        });
      });
      describe(getQualMeasurementOrThrow.name, () => {
        it("should return a qual measurement", async () => {
          const p = prisMock(
            "measurement_qualitative",
            "findUniqueOrThrow",
            true,
          );
          const res = await getQualMeasurementOrThrow(ID);
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toBeDefined();
        });
      });
      describe(createQuantMeasurement.name, () => {
        it("should return a quant measurement", async () => {
          const p = prisMock("measurement_quantitative", "create", true);
          const res = await createQuantMeasurement({ test: 1 } as any);
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toEqual({ data: { test: 1 } });
        });
      });
      describe(createQualMeasurement.name, () => {
        it("should return a qual measurement", async () => {
          const p = prisMock("measurement_qualitative", "create", true);
          const res = await createQualMeasurement({ test: 1 } as any);
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toEqual({ data: { test: 1 } });
        });
      });
      describe(getQuantMeasurementsByCritterId.name, () => {
        it("should return a quant measurement by critter_id", async () => {
          const p = prisMock("critter", "findUniqueOrThrow", "uuid");
          const b = prisMock("measurement_quantitative", "findMany", [true]);
          const res = await getQuantMeasurementsByCritterId(ID);
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toEqual({ where: { critter_id: ID } });
          expect(b.mock.calls.length).toBe(1);
          expect(b.mock.calls[0][0]).toEqual({ where: { critter_id: ID } });
        });
      });
      describe(getQualMeasurementOrThrow.name, () => {
        it("should return a qual measurement by critter_id", async () => {
          const p = prisMock("critter", "findUniqueOrThrow", "uuid");
          const b = prisMock("measurement_qualitative", "findMany", [true]);
          const res = await getQualMeasurementsByCritterId(ID);
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toEqual({ where: { critter_id: ID } });
          expect(b.mock.calls.length).toBe(1);
          expect(b.mock.calls[0][0]).toEqual({ where: { critter_id: ID } });
        });
      });
      describe(updateQualMeasurement.name, () => {
        it("should update and return a qual measurement", async () => {
          const p = prisMock("measurement_qualitative", "update", true);
          const res = await updateQualMeasurement(ID, {});
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toBeDefined();
        });
      });
      describe(updateQuantMeasurement.name, () => {
        it("should update and return a quant measurement", async () => {
          const p = prisMock("measurement_quantitative", "update", true);
          const res = await updateQuantMeasurement(ID, {});
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toBeDefined();
        });
      });
      describe(deleteQualMeasurement.name, () => {
        it("should delete and return a qual measurement", async () => {
          const p = prisMock("measurement_qualitative", "delete", true);
          const res = await deleteQualMeasurement(ID);
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toEqual({
            where: { measurement_qualitative_id: ID },
          });
        });
      });
      describe(deleteQuantMeasurement.name, () => {
        it("should delete and return a quant measurement", async () => {
          const p = prisMock("measurement_quantitative", "delete", true);
          const res = await deleteQuantMeasurement(ID);
          expect(res);
          expect(p.mock.calls.length).toBe(1);
          expect(p.mock.calls[0][0]).toEqual({
            where: { measurement_quantitative_id: ID },
          });
        });
        describe(getMeasurementsByCritterId.name, () => {
          it("should return qual and quant measurements for a critter_id", async () => {
            const res = await getMeasurementsByCritterId(ID);
            expect(res);
            expect(res).toHaveProperty("quantitative");
            expect(res).toHaveProperty("qualitative");
          });
        });
      });
    });
  });

  describe("ZOD SCHEMA", () => {
    describe("QualitativeResponseSchema", () => {
      it("should correctly format data", () => {
        const parsed = QualitativeResponseSchema.parse({
          temp: "hello world",
          xref_taxon_measurement_qualitative: 1,
          xref_taxon_measurement_qualitative_option: 2,
        });
        const {
          temp,
          measurement_name,
          option_label,
          option_value,
          xref_taxon_measurement_qualitative,
          xref_taxon_measurement_qualitative_option,
        } = parsed as any;
        expect(temp).toBeDefined();
        expect(xref_taxon_measurement_qualitative).not.toBeDefined();
        expect(xref_taxon_measurement_qualitative_option).not.toBeDefined();
        expect(measurement_name).toBeNull();
        expect(option_label).toBeNull();
        expect(option_label).toBeNull();
      });
    });
    describe("QuantitativeResponseSchema", () => {
      it("should correctly format data", () => {
        const parsed = QuantitativeResponseSchema.parse({
          temp: "hello world",
        });
        const { measurement_name, temp, xref_taxon_measurement_quantitative } =
          parsed as any;
        expect(measurement_name).toBeNull();
        expect(temp).toBeDefined();
        const parsed2 = QuantitativeResponseSchema.parse({
          xref_taxon_measurement_quantitative: { measurement_name: "TEST" },
        });
        expect(parsed2.measurement_name).toBe("TEST");
      });
    });
  });
});
