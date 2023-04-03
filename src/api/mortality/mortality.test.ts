import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { randomUUID } from "node:crypto";
import { after } from "node:test";
import { prisma, request } from "../../utils/constants";
import { apiError } from "../../utils/types";
import {
  createMortality,
  deleteMortality,
  getAllMortalities,
  getMortalityByCritter,
  getMortalityById,
  updateMortality,
} from "./mortality.service";
import { Prisma, mortality } from "@prisma/client";

const tempMortalities: mortality[] = [];

const obtainMortalityTemplate =
  async (): Promise<Prisma.mortalityUncheckedCreateInput> => {
    const testCritter = await prisma.critter.findFirst();
    const testCod = await prisma.lk_cause_of_death.findFirst();
    const taxon = await prisma.lk_taxon.findFirst();
    if (!testCritter || !testCod || !taxon) throw apiError.serverIssue();
    return {
      critter_id: testCritter.critter_id,
      mortality_timestamp: new Date(),
      proximate_cause_of_death_id: testCod.cod_id,
      proximate_predated_by_taxon_id: taxon.taxon_id,
      ultimate_cause_of_death_id: testCod.cod_id,
      ultimate_predated_by_taxon_id: taxon.taxon_id,
    };
  };

const createTempMortality = async (): Promise<mortality> => {
  const testMort = await prisma.mortality.create({
    data: {
      ...(await obtainMortalityTemplate()),
    },
  });
  tempMortalities.push(testMort);
  return testMort;
};

describe("API: Critter", () => {
  describe("SERVICES", () => {
    describe("getting mortalities", () => {
      it("returns all mortalities", async () => {
        const res = await getAllMortalities();
        expect.assertions(1);
        expect(res.length).toBeGreaterThanOrEqual(1);
      });
      it("returns one mortality", async () => {
        const m = await createTempMortality();
        const res = await getMortalityById(m.mortality_id);
        expect.assertions(1);
        expect(res?.mortality_id).toBe(m.mortality_id);
      });
      it("should get one or more mortalities for this critter", async () => {
        const critter = await prisma.critter.findFirstOrThrow();
        const res = await getMortalityByCritter(critter.critter_id);
        expect.assertions(1);
        expect(res.length).toBeGreaterThanOrEqual(1);
      });
    });
    describe("creating mortalities", () => {
      it("should create a mortality", async () => {
        const cod = await prisma.lk_cause_of_death.findFirst();
        const critter = await prisma.critter.findFirst();
        if (!critter || !cod) throw apiError.serverIssue();
        const res = await createMortality({
          critter_id: critter.critter_id,
          proximate_cause_of_death_id: cod.cod_id,
          mortality_timestamp: new Date(),
        });
        expect.assertions(1);
        expect(res).not.toBeNull();
        await prisma.mortality.delete({
          where: { mortality_id: res.mortality_id },
        });
      });
    });
    describe("modifying mortalities", () => {
      it("updates an existing mortality", async () => {
        const m = await createTempMortality();
        const res = await updateMortality(m.mortality_id, {
          mortality_comment: "banana",
        });
        expect.assertions(1);
        expect(res.mortality_comment).toBe("banana");
      });
      it("should delete an existing mortality", async () => {
        const m = await createTempMortality();
        const res = await deleteMortality(m.mortality_id);
        expect.assertions(1);
        expect(res.mortality_id).toBe(m.mortality_id);
      });
    });
  });
  describe("ROUTERS", () => {
    describe("GET /api/mortality", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.get("/api/mortality");
        expect(res.status).toBe(200);
      });
    });
    describe("GET /api/mortality/critter/:critter_id", () => {
      it("should return status 200", async () => {
        const mort = await prisma.mortality.findFirst();
        if (!mort) throw apiError.serverIssue();
        const critter = mort?.critter_id;
        expect.assertions(2);
        const res = await request.get("/api/mortality/critter/" + critter);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
      it("should return status 404", async () => {
        const res = await request.get("/api/mortality/critter/" + randomUUID());
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("POST /api/mortality/create", () => {
      it("should return status 200", async () => {
        const m = await obtainMortalityTemplate();
        const res = await request.post("/api/mortality/create").send(m);
        expect.assertions(1);
        expect(res.status).toBe(201);
      });
    });
    describe("GET /api/mortality/:mortality_id", () => {
      it("should return status 200", async () => {
        const m = await createTempMortality();
        //console.log('Got this temp mortality\n' + JSON.stringify(m, null, 2));
        const res = await request.get("/api/mortality/" + m.mortality_id);
        expect.assertions(1);
        console.log(res.body);
        expect(res.status).toBe(200);
      });
      it("should return status 404", async () => {
        const res = await request.get("/api/mortality/" + randomUUID());
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("PUT /api/mortality/:mortality_id", () => {
      it("should return status 200", async () => {
        const m = await createTempMortality();
        const mort = await request
          .put("/api/mortality/" + m.mortality_id)
          .send({ mortality_comment: "banana" });
        //console.log("res was " + JSON.stringify(mort, null, 2));
        expect.assertions(1);
        expect(mort.status).toBe(200);
      });
      it("should return status 400", async () => {
        const m = await createTempMortality();
        const mort = await request
          .put("/api/mortality/" + m.mortality_id)
          .send({ mortality_comment: 123 });
        expect.assertions(1);
        expect(mort.status).toBe(400);
      });
    });
    describe("DELETE /api/mortality/:mortality_id", () => {
      it("should return status 200", async () => {
        const m = await createTempMortality();
        const mort = await request.delete("/api/mortality/" + m.mortality_id);
        expect.assertions(1);
        expect(mort.status).toBe(200);
      });
    });
  });
});

afterAll(async () => {
  for (const m of tempMortalities) {
    if (
      await prisma.mortality.findUnique({
        where: { mortality_id: m.mortality_id },
      })
    ) {
      await prisma.mortality.delete({
        where: {
          mortality_id: m.mortality_id,
        },
      });
    }
  }
});
