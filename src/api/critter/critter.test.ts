import { critter, Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { queryRandomUUID } from "../../../prisma/prisma_utils";
import { prisma } from "../../utils/constants";
import {
  createCritter as _createCritter,
  deleteCritter as _deleteCritter,
  getAllCritters as _getAllCritters,
  getCritterById as _getCritterById,
  getCritterByWlhId as _getCritterByWlhId,
  updateCritter as _updateCritter,
  getMultipleCrittersByIds as _getMultipleCrittersByIds,
  getSimilarCritters as _getSimilarCritters,
} from "./critter.service";
import { randomUUID } from "crypto";
import { makeApp } from "../../app";
import supertest from "supertest";
import { ICbDatabase } from "../../utils/database";
import { loginUser } from "../access/access.service";
import { CritterCreateSchema, CritterDefaultResponse, CritterDefaultResponseSchema, CritterSchema } from "./critter.utils";
import { apiError } from "../../utils/types";

const getAllCritters = jest.fn();
const getMultipleCrittersByIds = jest.fn();
const getCritterById = jest.fn();
const getCritterByIdWithDetails = jest.fn();
const getCritterByWlhId = jest.fn();
const updateCritter = jest.fn();
const createCritter = jest.fn();
const getSimilarCritters = jest.fn();
const deleteCritter = jest.fn();


const request = supertest(
  makeApp({
    getAllCritters,
    getMultipleCrittersByIds,
    getCritterById,
    getCritterByIdWithDetails,
    getCritterByWlhId,
    updateCritter,
    createCritter,
    getSimilarCritters,
    deleteCritter,
  } as Record<keyof ICbDatabase, any>)
);

const create = jest.spyOn(prisma.critter, "create").mockImplementation();
const update = jest.spyOn(prisma.critter, "update").mockImplementation();
const findMany = jest.spyOn(prisma.critter, "findMany").mockImplementation();
const findUniqueOrThrow = jest.spyOn(prisma.critter, "findUniqueOrThrow").mockImplementation();
const pDelete = jest.spyOn(prisma.critter, "delete").mockImplementation();


const CRITTER_ID = '11084b96-5cbd-421e-8106-511ecfb51f7a';
const WLH_ID = '12-1234';
const CRITTER: critter = {
  critter_id: CRITTER_ID,
  taxon_id: '98f9fede-95fc-4321-9444-7c2742e336fe',
  wlh_id: WLH_ID,
  animal_id: 'A13',
  sex: "Male",
  responsible_region_nr_id: '4804d622-9539-40e6-a8a5-b7b223c2f09f',
  create_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  update_user: '1af85263-6a7e-4b76-8ca6-118fd3c43f50',
  create_timestamp: new Date(),
  update_timestamp: new Date(),
  critter_comment: 'Hi :)'
};

const DEFAULTFORMAT_CRITTER = {
  ...CRITTER,
  lk_taxon: {
    taxon_name_common: 'Caribou',
    taxon_name_latin: 'Rangifer tarandus'
  },
  lk_region_nr: {
    region_nr_name: 'Somewhere'
  },
  critter_collection_unit: [{
    xref_collection_unit: {
      lk_collection_category: { category_name: 'name', collection_category_id: '1af85263-6a7e-4b76-8ca6-118fd3c43f50'},
      unit_name: 'name',
      unit_description: 'desc'
    }
  }],
  mortality: []
}

const DETAILEDFORMAT_CRITTER = {
  ...DEFAULTFORMAT_CRITTER,
  user_critter_create_userTouser: {
    system_name: 'CRITTERBASE'
  },
  capture: [],
  marking: [],
  measurement_qualitative: [],
  measurement_quantitative: []
}

beforeAll( async () => {
  const tax = await prisma.lk_taxon.findFirstOrThrow({
    where: { taxon_name_common: 'Caribou'}
  });
  CRITTER.taxon_id = tax.taxon_id;
})

beforeEach(() => {
  getAllCritters.mockReset();
  getMultipleCrittersByIds.mockReset();
  getCritterById.mockReset();
  getCritterByIdWithDetails.mockReset();
  getCritterByWlhId.mockReset();
  updateCritter.mockReset();
  createCritter.mockReset();
  getSimilarCritters.mockReset();
  deleteCritter.mockReset();

 // getAllCritters.mockResolvedValue(Promise.resolve([DEFAULTFORMAT_CRITTER]));
  getAllCritters.mockImplementation(() => {
    return [DEFAULTFORMAT_CRITTER];
  })
  getCritterById.mockResolvedValue(() => {
    return DEFAULTFORMAT_CRITTER;
  });
  getCritterByWlhId.mockImplementation(() => {
    return [DEFAULTFORMAT_CRITTER];
  });

  createCritter.mockImplementation(() => {
    return DEFAULTFORMAT_CRITTER;
  });

  getCritterByIdWithDetails.mockImplementation(() => {
    return DEFAULTFORMAT_CRITTER;
  });

  deleteCritter.mockImplementation(() => {
    return DEFAULTFORMAT_CRITTER;
  })

})

describe("API: Critter", () => {
  describe("SERVICES", () => {
    describe("createCritter", () => {
      it("creates a critter", async () => {
        create.mockResolvedValue(CRITTER);
        const returnedCritter = await _createCritter(CRITTER);
        expect.assertions(2);
        expect(prisma.critter.create).toHaveBeenCalled();
        expect(CritterSchema.safeParse(returnedCritter).success).toBe(true);
      });
      it("fails to create a critter", async () => {
       create.mockRejectedValue(new Error());
       await expect(_createCritter(CRITTER)).rejects.toThrow();
      });
    });
    describe("getAllCritters()", () => {
      it("returns many critters", async () => {
        findMany.mockResolvedValue([CRITTER]);
        const returnedCritter = await _getAllCritters();
        expect.assertions(3);
        expect(prisma.critter.findMany).toHaveBeenCalled();
        expect(returnedCritter).toBeInstanceOf(Array);
        expect(returnedCritter.length).toBe(1);
      });
    });
    describe("getCritterById()", () => {
      it("returns a critter by ID", async () => {
        findUniqueOrThrow.mockResolvedValue(CRITTER);
        const returnedCritter = await _getCritterById(CRITTER_ID);
        expect.assertions(1);
        expect(prisma.critter.findUniqueOrThrow).toHaveBeenCalled();
      })
    });
    describe("getCritterByWlhId(wlh_id: string)", () => {
      it("returns a critter by wlh_id", async () => {
        findMany.mockResolvedValue([CRITTER]);
        const returnedCritter = await _getCritterByWlhId(WLH_ID);
        expect.assertions(1);
        expect(prisma.critter.findMany).toHaveBeenCalled();
      })
    });
    describe("updateCritter()", () => {
      it("updates a critter with the body provided", async () => {
        update.mockResolvedValue(CRITTER);
        const returnedCritter = await _updateCritter(CRITTER_ID, CRITTER);
        expect.assertions(2);
        expect(prisma.critter.update).toHaveBeenCalled();
        expect(CritterSchema.safeParse(returnedCritter).success).toBe(true);
      })
    });
    describe("deleteCritter()", () => {
      it("should delete a critter", async () => {
        pDelete.mockResolvedValue(CRITTER);
        const returnedCritter = await _deleteCritter(CRITTER_ID);
        expect.assertions(2);
        expect(prisma.critter.delete).toHaveBeenCalled();
        expect(CritterSchema.safeParse(returnedCritter).success).toBe(true);
      })
    });
  });
  describe("ROUTERS", () => {
    describe("GET /api/critters", () => {
      it("should return status 200", async () => {
        expect.assertions(3);
        const res = await request.get("/api/critters");
        expect(res.status).toBe(200);
        expect(getAllCritters.mock.calls.length).toBe(1);
        expect(getAllCritters.mock.results[0].value[0].critter_id).toBe(CRITTER_ID);
      });
    });
    describe("POST /api/critters/create", () => {
      it("should return a critter with status code 201", async () => {
        const res = await request.post("/api/critters/create").send(CRITTER);
        expect.assertions(2);
        expect(res.status).toBe(201);
        expect(res.body.wlh_id).toBe(WLH_ID);
      });
      it("should return 400 if trying to create with bad value type", async () => {
        const res = await request
          .post("/api/critters/create")
          .send({ taxon_id: '11084b96-5cbd-421e-8106-511ecfb51f7a', sex: 123 });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
    });
    describe("GET /api/critters?wlh_id={wlh_id}", () => {
      it("should return status 200 and a valid critter", async () => {
        const res = await request.get("/api/critters?wlh_id=" + WLH_ID);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
      it("should return status 404 if searching bad wlh id", async () => {
        getCritterByWlhId.mockImplementation(() => {
          return [];
        })
        const res = await request.get("/api/critters?wlh_id=WHAT");
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("GET /api/critters/:id", () => {
      it("should return status 200", async () => {
        const res = await request.get("/api/critters/" + CRITTER_ID);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });
      it("should return status 404 when critter id is not found", async () => {
        getCritterByIdWithDetails.mockImplementation(() => {
          throw apiError.notFound('critter_id');
        })
        const res = await request.get("/api/critters/" + randomUUID());
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("PUT /api/critters/:id", () => {
      it("should return status 200, and update the critter", async () => {
        updateCritter.mockImplementation(() => {
          return {...DEFAULTFORMAT_CRITTER, animal_id: 'Banana'}
        })
        const res = await request
          .put("/api/critters/" + CRITTER_ID)
          .send({ animal_id: "Banana" });
        console.log(JSON.stringify(res,null,2));
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.animal_id).toBe("Banana");
      });
      it("should return status 400 if you try to modify with a bad value type", async () => {
        updateCritter.mockImplementation(() => {
          throw Error();
        });
        const res = await request
          .put("/api/critters/" + CRITTER_ID)
          .send({ sex: 1234 });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
      it("should return status 404 when critter id is not found", async () => {
        updateCritter.mockImplementation(() => {
          throw apiError.notFound('critter_id');
        });
        const res = await request.put("/api/critters/" + randomUUID()).send({ animal_id: "Banana" });;
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("DELETE /api/critters/:id", () => {
      it("should return status 200 and delete the critter", async () => {
        const res = await request.delete("/api/critters/" + CRITTER_ID);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.wlh_id).toBe(WLH_ID);
      });
      it("should return status 404 when critter id is not found", async () => {
        deleteCritter.mockImplementation(() => {
          throw apiError.notFound('not found');
        })
        const res = await request.delete("/api/critters/" + randomUUID());
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
  });
});
