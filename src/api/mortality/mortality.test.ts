import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { randomUUID } from "node:crypto";
import { after } from "node:test";
import { prisma } from "../../utils/constants";
import { apiError } from "../../utils/types";
import { 
  createMortality as _createMortality, 
  deleteMortality as _deleteMortality, 
  getAllMortalities as _getAllMortalities, 
  getMortalityByCritter as _getMortalityByCritter, 
  getMortalityById as _getMortalityById, 
  updateMortality as _updateMortality,
  appendDefaultCOD as _appendDefaultCod
} from './mortality.service'
import { Prisma, critter, lk_cause_of_death, mortality } from "@prisma/client";
import { makeApp } from "../../app";
import { ICbDatabase } from "../../utils/database";
import supertest from "supertest";
import { FormattedMortality, MortalityBodySchema, MortalityResponseSchema } from "./mortality.utils";

const createMortality = jest.fn();
const deleteMortality = jest.fn();
const getAllMortalities = jest.fn();
const getMortalityByCritter = jest.fn();
const getMortalityById = jest.fn();
const updateMortality = jest.fn();

const request = supertest(
  makeApp({
    createMortality,
    deleteMortality,
    getAllMortalities,
    getMortalityById,
    updateMortality,
    getMortalityByCritter
  } as Record<keyof ICbDatabase, any>)
)

const create = jest.spyOn(prisma.mortality, "create").mockImplementation();
const update = jest.spyOn(prisma.mortality, "update").mockImplementation();
const mdelete = jest.spyOn(prisma.mortality, "delete").mockImplementation();
const findMany = jest.spyOn(prisma.mortality, "findMany").mockImplementation();
const findUniqueOrThrow = jest.spyOn(prisma.mortality, "findUniqueOrThrow").mockImplementation();
const codFindFirstOrThrow = jest.spyOn(prisma.lk_cause_of_death, "findFirstOrThrow").mockImplementation();

const CRITTER_ID = "11084b96-5cbd-421e-8106-511ecfb51f7a"
const MORTALITY_ID = "1af85263-6a7e-4b76-8ca6-118fd3c43f50"
const MORTALITY: mortality = {
  mortality_id: MORTALITY_ID,
  critter_id: CRITTER_ID,
  location_id: null,
  mortality_timestamp: new Date(),
  proximate_cause_of_death_id: "11084b96-5cbd-421e-8106-511ecfb51f7a",
  proximate_cause_of_death_confidence: null,
  proximate_predated_by_taxon_id: null,
  ultimate_cause_of_death_id: null,
  ultimate_cause_of_death_confidence: null,
  ultimate_predated_by_taxon_id: null,
  mortality_comment: null,
  create_user: "11084b96-5cbd-421e-8106-511ecfb51f7a",
  update_user: "11084b96-5cbd-421e-8106-511ecfb51f7a",
  create_timestamp: new Date(),
  update_timestamp: new Date()
}


const LOCATION = {
  latitude: 2,
  longitude: 2,
  coordinate_uncertainty: 2,
  temperature: 2,
  location_comment: "test",
  lk_region_env: null,
  lk_region_nr: null,
  lk_wildlife_management_unit: null
}

const COD: lk_cause_of_death = {
  cod_id: "cd606593-c448-4c01-9824-0f7ea9ef3d10",
  cod_category: "Unknown",
  cod_reason: null,
  create_user: "cd606593-c448-4c01-9824-0f7ea9ef3d10",
  update_user: "cd606593-c448-4c01-9824-0f7ea9ef3d10",
  create_timestamp: new Date(),
  update_timestamp: new Date()
}

const CRITTER: critter = {
  critter_id: CRITTER_ID,
  taxon_id: '98f9fede-95fc-4321-9444-7c2742e336fe',
  wlh_id: '12-1234',
  animal_id: 'A13',
  sex: "Male",
  responsible_region_nr_id: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  create_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  update_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  create_timestamp: new Date(),
  update_timestamp: new Date(),
  critter_comment: 'Hi :)'
};

const MORTALITY_FORMATTED = {
  ...MORTALITY,
  location: LOCATION,
  lk_cause_of_death_mortality_proximate_cause_of_death_idTolk_cause_of_death: { cod_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50'},
  lk_cause_of_death_mortality_ultimate_cause_of_death_idTolk_cause_of_death: { cod_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50'},
  lk_taxon_mortality_proximate_predated_by_taxon_idTolk_taxon: { taxon_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50'},
  lk_taxon_mortality_ultimate_predated_by_taxon_idTolk_taxon: { taxon_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50'}
}

beforeEach(() => {
  createMortality.mockImplementation(() => {
    return MORTALITY;
  });
  updateMortality.mockImplementation(() => {
    return MORTALITY;
  });
  deleteMortality.mockImplementation(() => {
    return MORTALITY;
  });
  getAllMortalities.mockImplementation(() => {
    return [MORTALITY];
  })
  getMortalityById.mockImplementation(() => {
    return MORTALITY;
  });
  getMortalityByCritter.mockImplementation(() => {
    return [MORTALITY];
  });

})

describe("API: Critter", () => {
  describe("UTILS", () => {
    describe("MoratlityResponseSchema", () => {
      it("test with extra info included", () => {
        const parsed = MortalityResponseSchema.parse(MORTALITY_FORMATTED);
        expect.assertions(5);
        expect(parsed.location).toBeDefined();
        expect(parsed.proximate_cause_of_death).toBeDefined();
        expect(parsed.ultimate_cause_of_death).toBeDefined();
        expect(parsed.proximate_cause_of_death_taxon).toBeDefined();
        expect(parsed.ultimate_cause_of_death_taxon).toBeDefined();
      })
      it("test with no extra info included", () => {
        const parsed = MortalityResponseSchema.parse(MORTALITY);
        expect.assertions(5);
        expect(parsed.location).toBeNull();
        expect(parsed.proximate_cause_of_death).toBeNull();
        expect(parsed.ultimate_cause_of_death).toBeNull();
        expect(parsed.proximate_cause_of_death_taxon).toBeNull();
        expect(parsed.ultimate_cause_of_death_taxon).toBeNull();
      })
    })
  })
  describe("SERVICES", () => {
    describe("getting mortalities", () => {
      it("returns all mortalities", async () => {
        findMany.mockResolvedValue([MORTALITY]);
        const res = await _getAllMortalities();
        expect.assertions(2);
        expect(prisma.mortality.findMany).toHaveBeenCalled();
        expect(res.length).toBeGreaterThanOrEqual(1);
      });
      it("returns one mortality", async () => {
        findUniqueOrThrow.mockResolvedValue(MORTALITY_FORMATTED);
        const res = await _getMortalityById(MORTALITY_ID);
        expect.assertions(2);
        expect(prisma.mortality.findUniqueOrThrow).toHaveBeenCalled();
        expect(res?.mortality_id).toBe(MORTALITY_ID);
      });
      it("should get one or more mortalities for this critter", async () => {
        findMany.mockResolvedValue([MORTALITY_FORMATTED])
        const res = await _getMortalityByCritter(CRITTER_ID);
        expect.assertions(2);
        expect(prisma.mortality.findMany).toHaveBeenCalled();
        expect(res.length).toBeGreaterThanOrEqual(1);
      });
    });
    describe("creating mortalities", () => {
      it("should create a mortality", async () => {
        create.mockResolvedValue(MORTALITY);
        const res = await _createMortality({
          critter_id: CRITTER_ID, 
          proximate_cause_of_death_id: '6109c0a8-a71d-4662-9604-a8beb72f2f6f', 
          proximate_predated_by_taxon_id: '6109c0a8-a71d-4662-9604-a8beb72f2f6f',
          ultimate_cause_of_death_id: '6109c0a8-a71d-4662-9604-a8beb72f2f6f',
          ultimate_predated_by_taxon_id: '6109c0a8-a71d-4662-9604-a8beb72f2f6f',
          mortality_timestamp: new Date()});
        expect.assertions(3);
        expect(MortalityBodySchema.safeParse(res).success).toBe(true);
        expect(res.mortality_id).toBe(MORTALITY_ID);
        expect(prisma.mortality.create).toHaveBeenCalled();
      });
      it("should create a mortality with included location", async () => {
        create.mockResolvedValue({...MORTALITY, location_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10'});
        const res = await _createMortality({
          ...MORTALITY,
          location: LOCATION
        });
        expect.assertions(4);
        expect(MortalityBodySchema.safeParse(res).success).toBe(true);
        expect(res.mortality_id).toBe(MORTALITY_ID);
        expect(res.location_id).toBe('cd606593-c448-4c01-9824-0f7ea9ef3d10')
        expect(prisma.mortality.create).toHaveBeenCalled();
      });
      it("creates mortality and assigns the location_id", async () => {
        create.mockResolvedValue({...MORTALITY, location_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10'});
        const res = await _createMortality({...MORTALITY, location_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10' });
        expect.assertions(2);
        expect(prisma.mortality.create).toHaveBeenCalled();
        expect(res.location_id).toBe('cd606593-c448-4c01-9824-0f7ea9ef3d10');
      })
    });
    describe("modifying mortalities", () => {
      it("updates an existing mortality", async () => {
        update.mockResolvedValue({...MORTALITY, 
        mortality_comment: 'banana', 
        ultimate_cause_of_death_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10',
        proximate_predated_by_taxon_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10',
        ultimate_predated_by_taxon_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10'})
        const res = await _updateMortality(MORTALITY_ID, 
          {
            mortality_comment: 'banana',
            ultimate_cause_of_death_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10',
            proximate_predated_by_taxon_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10',
            ultimate_predated_by_taxon_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10'
          });
        expect.assertions(2);
        expect(prisma.mortality.update).toHaveBeenCalled();
        expect(res.mortality_comment).toBe('banana');
      });
      it("updates mortality and upserts the attached location", async () => {
        update.mockResolvedValue({...MORTALITY, location_id: 'cd606593-c448-4c01-9824-0f7ea9ef3d10'});
        const res = await _updateMortality(MORTALITY_ID, {...MORTALITY, location: LOCATION });
        expect.assertions(2);
        expect(prisma.mortality.update).toHaveBeenCalled();
        expect(res.location_id).toBe('cd606593-c448-4c01-9824-0f7ea9ef3d10');
      });
      it("should delete an existing mortality", async () => {
        mdelete.mockResolvedValue(MORTALITY);
        const res = await _deleteMortality(MORTALITY_ID);
        expect.assertions(2);
        expect(prisma.mortality.delete).toHaveBeenCalled();
        expect(res.mortality_id).toBe(MORTALITY_ID);
      })
    });
    describe("appendDefaultCOD(body)", () => {
      it("should return Unknown cod_category to the provided body", async () => {
        codFindFirstOrThrow.mockResolvedValue(COD);
        const res = await _appendDefaultCod({proximate_cause_of_death_id: undefined});
        expect.assertions(2);
        expect(prisma.lk_cause_of_death.findFirstOrThrow).toHaveBeenCalled();
        expect(res.proximate_cause_of_death_id).not.toBeUndefined();
      })
    })
  });
  describe("ROUTERS", () => {
    describe("GET /api/mortality", () => {
      it("should return status 200", async () => {
        expect.assertions(3);
        const res = await request.get("/api/mortality");
        expect(getAllMortalities.mock.calls.length).toBe(1);
        expect(getAllMortalities.mock.results[0].value[0].mortality_id).toBe(MORTALITY_ID);
        expect(res.status).toBe(200);
      });
    });
    describe("GET /api/mortality/critter/:critter_id", () => {
      it("should return status 200", async () => {
        getMortalityByCritter.mockResolvedValue([CRITTER]);
        const res = await request.get("/api/mortality/critter/" + CRITTER_ID);
        expect.assertions(3);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(getMortalityByCritter.mock.calls.length).toBe(1);
      })
      it("should return status 404", async () => {
        getMortalityByCritter.mockImplementation(() => {
          throw apiError.notFound('not found');
        })
        const res = await request.get("/api/mortality/critter/" + randomUUID());
        expect.assertions(2);
        expect(getMortalityByCritter.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      });
    });
    describe("POST /api/mortality/create", () => {
      it("should return status 200", async () => {
        const res = await request.post("/api/mortality/create").send(MORTALITY);
        expect.assertions(2);
        expect(createMortality.mock.calls.length).toBe(1);
        expect(res.status).toBe(201);
      })
    })
    describe("GET /api/mortality/:mortality_id", () => {
      it("should return status 200", async () => {
        const res = await request.get("/api/mortality/" + MORTALITY_ID);
        expect.assertions(2);
        expect(getMortalityById.mock.calls.length).toBe(1);
        expect(res.status).toBe(200);
      });
      it("should return status 404", async () => {
        getMortalityById.mockImplementation(() => {
          throw apiError.notFound('not found');
        })
        const res = await request.get("/api/mortality/" + randomUUID())
        expect.assertions(2);
        expect(getMortalityById.mock.calls.length).toBe(1);
        expect(res.status).toBe(404);
      })
    });
    describe("PATCH /api/mortality/:mortality_id", () => {
      it("should return status 200",async () => {
        updateMortality.mockResolvedValue({...MORTALITY, mortality_comment: 'banana'});
        const mort = await request.patch("/api/mortality/" + MORTALITY_ID)
          .send({mortality_comment: 'banana'});
        expect.assertions(2);
        expect(updateMortality.mock.calls.length).toBe(1);
        expect(mort.status).toBe(200);
      });
      it("should return status 400", async () => {
        updateMortality.mockImplementation(() => {
          throw Error()
        })
        const mort = await request.patch("/api/mortality/" + '6109c0a8-a71d-4662-9604-a8beb72f2f6f').send({mortality_comment: 123});
        expect.assertions(1);
        expect(mort.status).toBe(400);
      })
    });
    describe("DELETE /api/mortality/:mortality_id", () => {
      it("should return status 200", async () => {
        const mort = await request.delete("/api/mortality/" + MORTALITY_ID);
        expect.assertions(2);
        expect(deleteMortality.mock.calls.length).toBe(1);
        expect(mort.status).toBe(200);
      });
    })
  });
});
