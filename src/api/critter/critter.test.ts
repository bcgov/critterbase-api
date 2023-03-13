import { critter, Prisma } from "@prisma/client";
import { queryRandomUUID } from "../../../prisma/prisma_utils";
import { prisma, request } from "../../utils/constants";
import { createCritter, deleteCritter, getAllCritters, getCritterById, getCritterByWlhId, updateCritter } from "./critter.service";


let dummyCritter: Prisma.critterUncheckedCreateInput;
let dummyTaxon: string | undefined;

beforeAll(async () => {
  dummyTaxon = (await prisma.lk_taxon.findFirst({where: {
    taxon_name_latin: {
      equals: 'Rangifer tarandus',
      mode: 'insensitive'
    }
  }}))?.taxon_id;
  if(!dummyTaxon) throw Error('Could not get taxon for dummy.');
  dummyCritter = {
    critter_id: await queryRandomUUID(prisma),
    sex: 'Male',
    wlh_id: 'TEST',
    taxon_id: dummyTaxon
  }
})

describe("API: Critter", () => {
  describe("SERVICES", () => {
    describe("making critters", () => {
      it("creates a critter", async() => {
        const critter = await createCritter(dummyCritter);
        expect.assertions(3);
        expect(critter.wlh_id).toBe('TEST');
        expect(critter.sex).toBe('Male');
        expect(critter.taxon_id).toBe(dummyTaxon);
      })
    })
    describe("getting critters", () => {
      it("returns many critters", async () => {
        const critters = await getAllCritters();
        expect.assertions(1);
        expect(critters.length).toBeGreaterThan(1);
      });
      it("returns just one critter", async () => {
        const critter = await getCritterById(dummyCritter.critter_id as string);
        expect.assertions(1);
        expect(critter?.critter_id).toBe(dummyCritter.critter_id);
      });
      it("returns one critter matching the WLH ID", async () => {
        const critters = await getCritterByWlhId('TEST');
        expect.assertions(2);
        expect(critters?.length).toBe(1);
        expect(critters?.[0].wlh_id).toBe('TEST');
      })
    });
    describe("modifying critters", () => {
      it("updates a critter with the specified value", async () => {
        const critter_id = (await prisma.critter.findFirst({where: { wlh_id: 'TEST'}}))?.critter_id;
        if(!critter_id) {
          throw Error('no critter id found for update');
        }
        const critter = await updateCritter(critter_id, {'animal_id':'macaroni'});
        expect.assertions(2);
        expect(critter.wlh_id).toBe('TEST');
        expect(critter.animal_id).toBe('macaroni');
      })
      it("deletes a critter with the specified id", async () => {
        const critter_id = (await prisma.critter.findFirst({where: { wlh_id: 'TEST'}}))?.critter_id;
        if(!critter_id) {
          throw Error('no critter id found for update');
        }
        await deleteCritter(critter_id);
        const deleted = (await prisma.critter.findFirst({where: { wlh_id: 'TEST'}}));
        expect(deleted).toBeNull();
      })
    })
  });
  describe("ROUTERS", () => {
    describe("GET /api/critters", () => {
      it("should return status 200", async () => {
        expect.assertions(2);
        const res = await request.get("/api/critters");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(1);
      });
    });
    describe("POST /api/critters/create", () => {
      it("should return a critter with status code 201", async () => {
        const res = await request.post("/api/critters/create").send(dummyCritter);
        expect.assertions(2);
        expect(res.status).toBe(201);
        expect(res.body.wlh_id).toBe('TEST');
      })
    })
    describe("GET /api/critters/wlh/:wlh_id", () => {
      it("should return status 200 and a valid critter", async () => {
        const res = await request.get("/api/critters/wlh/TEST");
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
      it("should return status 500", async () => {
        const res = await request.get("/api/critters/wlh/WHAT");
        expect.assertions(1);
        expect(res.status).toBe(500);
      });
    })
    describe("GET /api/critters/:id", () => {
      it("should return status 200, contain the requested critter along with markings and measures", async () => {
        const critter = await prisma.critter.findFirst({
          where: {
            wlh_id: '18-13137'
          }
        });
        const critter_id = critter?.critter_id;
        const res = await request.get("/api/critters/" + critter_id);
        expect.assertions(5);
        expect(res.status).toBe(200);
        expect(res.body.critter_id).toBe(critter_id);
        expect(res.body.marking.length).toBeGreaterThanOrEqual(1);
        expect(res.body.measurement_qualitative.length).toBeGreaterThanOrEqual(1);
        expect(res.body.measurement_quantitative.length).toBeGreaterThanOrEqual(1);
      });
      it("should return status 404 when critter id is not found", async () => {
        const res = await request.get("/api/critters/deadbeef-dead-dead-dead-deaddeafbeef");
        expect.assertions(1);
        expect(res.status).toBe(500);
      });
    })
    describe("PUT /api/critters/:id",  () => {
      it("should return status 200, and update the critter", async () => {
        const res = await request.put("/api/critters/" + dummyCritter.critter_id).send({animal_id: 'Banana'});
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.animal_id).toBe('Banana');
      })
      it("should return status 500 if you try to modify with a bad value type", async () => {
        const res = await request.put("/api/critters/" + dummyCritter.critter_id).send({sex: 1234});
        expect.assertions(1);
        expect(res.status).toBe(500);
      })
    })
    describe("DELETE /api/critters/:id",  () => {
      it("should return status 200 and delete the critter", async () => {
        const res = await request.delete("/api/critters/" + dummyCritter.critter_id);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.wlh_id).toBe('TEST');
      })
    })
  });
});

afterAll(async () => {
  const critter_id = (await prisma.critter.findFirst({where: { wlh_id: 'TEST'}}))?.critter_id;
  if(critter_id) {
    await prisma.critter.delete({ where: {critter_id: critter_id}})
  }
});
