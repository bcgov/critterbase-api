import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { randomUUID } from "node:crypto";
import { after } from "node:test";
import { prisma, request } from "../../utils/constants";
import { apiError } from "../../utils/types";
import {createMortality, deleteMortality, getAllMortalities, getMortalityByCritter, getMortalityById, updateMortality} from './mortality.service'

let testMort;
let testCritter;
beforeAll(async () => {
  testCritter = await prisma.critter.findFirst();
  const cod = await prisma.lk_cause_of_death.findFirst();
  const taxon = await prisma.lk_taxon.findFirst();
  if(!testCritter || !cod || !taxon) throw apiError.serverIssue();
  testMort = await prisma.mortality.create({
    data: {
      critter_id: testCritter.critter_id,
      mortality_timestamp: new Date(),
      proximate_cause_of_death_id: cod.cod_id,
      proximate_predated_by_taxon_id: taxon.taxon_id,
      ultimate_cause_of_death_id: cod.cod_id,
      ultimate_predated_by_taxon_id: taxon.taxon_id
    }
  })
})

describe("API: Critter", () => {
  describe("SERVICES", () => {
    describe("getting mortalities", () => {
      it("returns all mortalities", async () => {
        const res = await getAllMortalities();
        expect.assertions(1);
        expect(res.length).toBeGreaterThanOrEqual(1);
      });
      it("returns one mortality", async () => {
        const res = await getMortalityById(testMort.mortality_id);
        expect.assertions(1);
        expect(res?.mortality_id).toBe(testMort.mortality_id);
      });
      it("returns null, mortality not found", async () => {
        const res = await getMortalityById('deadbeef-dead-dead-dead-deaddeafbeef');
        expect.assertions(1);
        expect(res).toBeNull();
      })
      it("should get one or more mortalities for this critter", async () => {
        const res = await getMortalityByCritter(testCritter.critter_id);
        expect.assertions(1);
        expect(res.length).toBeGreaterThanOrEqual(1);
      });
    });
    describe("creating mortalities", () => {
      it("should create a mortality", async () => {
        const cod = await prisma.lk_cause_of_death.findFirst();
        const critter = await prisma.critter.findFirst();
        if(!critter || !cod) throw apiError.serverIssue();
        const res = await createMortality({
          critter_id: critter.critter_id, 
          proximate_cause_of_death_id: cod.cod_id, 
          mortality_timestamp: new Date()});
        expect.assertions(1);
        expect(res).not.toBeNull();
        await prisma.mortality.delete({
          where : {mortality_id: res.mortality_id}
        })
      });
      it("should fail to create a mortality", async () => {
        const cod = await prisma.lk_cause_of_death.findFirst();
        const critter = await prisma.critter.findFirst();
        if(!critter || !cod) throw apiError.serverIssue();
        const obj = {mortality_id: testMort.mortality_id, critter_id: critter.critter_id, proximate_cause_of_death_id: cod.cod_id, mortality_timestamp: new Date()};
        expect.assertions(1);
        await expect(async () => await createMortality(obj)).rejects.toBeInstanceOf(PrismaClientKnownRequestError);
  
      })
    });
    describe("modifying mortalities", () => {
      it("updates an existing mortality", async () => {
        const res = await updateMortality(testMort.mortality_id, {mortality_comment: 'banana'});
        expect.assertions(1);
        expect(res.mortality_comment).toBe('banana');
      })
      it("should delete an existing mortality", async () => {
        const res = await deleteMortality(testMort.mortality_id);
        expect.assertions(1);
        expect(res.mortality_id).toBe(testMort.mortality_id);
      })
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
        if(!mort) throw apiError.serverIssue();
        const critter = mort?.critter_id;
        expect.assertions(2);
        const res = await request.get("/api/mortality/critter/" + critter);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      })
      it("should return status 404", async () => {
        const res = await request.get("/api/mortality/critter/deadbeef-dead-dead-dead-deaddeafbeef" );
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("POST /api/mortality/create", () => {
      it("should return status 200", async () => {
        const res = await request.post("/api/mortality/create").send(testMort);
        expect.assertions(1);
        expect(res.status).toBe(201);
      })
    })
    describe("GET /api/mortality/:mortality_id", () => {
      it("should return status 200", async () => {
        const res = await request.get("/api/mortality/" + testMort.mortality_id);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });
      it("should return status 404", async () => {
        const res = await request.get("/api/mortality/deadbeef-dead-dead-dead-deaddeafbeef")
        expect.assertions(1);
        expect(res.status).toBe(404);
      })
    });
    describe("PUT /api/mortality/:mortality_id", () => {
      it("should return status 200",async () => {
        const mort = await request.put("/api/mortality/" + testMort.mortality_id).send({mortality_comment: 'banana'});
        expect.assertions(1);
        expect(mort.status).toBe(200);
      });
      it("should return status 400", async () => {
        const mort = await request.put("/api/mortality/" + testMort.mortality_id).send({mortality_comment: 123});
        expect.assertions(1);
        expect(mort.status).toBe(400);
      })
    });
    describe("DELETE /api/mortality/:mortality_id", () => {
      it("should return status 200", async () => {
        const mort = await request.delete("/api/mortality/" + testMort.mortality_id);
        expect.assertions(1);
        expect(mort.status).toBe(200);
      });
    })
  });
});

afterAll(async () => {
  if( (await prisma.mortality.findUnique({where: {mortality_id: testMort.mortality_id} })) ) {
    await prisma.mortality.delete({
      where: {
        mortality_id: testMort.mortality_id
      }
    })
  }
})
