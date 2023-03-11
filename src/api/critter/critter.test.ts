import { critter, Prisma } from "@prisma/client";
import { prisma, request } from "../../utils/constants";
import { createCritter, deleteCritter, getAllCritters, getCritterById, updateCritter } from "./critter.service";


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
        const critter = await getCritterById('6995c2ac-f137-4336-8085-e5bc5975e8f7');
        expect.assertions(1);
        expect(critter?.critter_id === '6995c2ac-f137-4336-8085-e5bc5975e8f7').toBeTruthy();
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
        expect.assertions(1);
        const res = await request.get("/api/critters");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(1);
      });
    });
  });
});

afterAll(async () => {
  const critter_id = (await prisma.critter.findFirst({where: { wlh_id: 'TEST'}}))?.critter_id;
  if(!critter_id) {
    throw Error('no critter id found for update');
  }
  await prisma.critter.delete({ where: {critter_id: critter_id}})
});
