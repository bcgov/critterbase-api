import { critter, Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { queryRandomUUID } from "../../../prisma/prisma_utils";
import { prisma, request } from "../../utils/constants";
import {
  createCritter,
  deleteCritter,
  getAllCritters,
  getCritterById,
  getCritterByWlhId,
  updateCritter,
} from "./critter.service";
import { randomUUID } from "crypto";

const tempCritters: critter[] = [];

const obtainCritterTemplate =
  async (): Promise<Prisma.critterUncheckedCreateInput> => {
    const dummyTaxon = (
      await prisma.lk_taxon.findFirst({
        where: {
          taxon_name_latin: {
            equals: "Rangifer tarandus",
            mode: "insensitive",
          },
        },
      })
    )?.taxon_id;
    if (!dummyTaxon) throw Error("Could not get taxon for dummy.");
    return {
      critter_id: await queryRandomUUID(prisma),
      sex: "Male",
      wlh_id: "TEST",
      taxon_id: dummyTaxon,
    };
  };

const createTempCritter = async (): Promise<critter> => {
  const critter = await obtainCritterTemplate();
  const res = await prisma.critter.create({
    data: critter,
  });
  tempCritters.push(res);
  return res;
};

describe("API: Critter", () => {
  describe("SERVICES", () => {
    describe("making critters", () => {
      it("creates a critter", async () => {
        const c = await obtainCritterTemplate();
        const critter = await createCritter(c);
        expect.assertions(2);
        expect(critter.wlh_id).toBe("TEST");
        expect(critter.sex).toBe("Male");
      });
      it("fails to create a critter", async () => {
        await expect(
          async () => await createCritter({} as any)
        ).rejects.toBeInstanceOf(PrismaClientValidationError);
      });
    });
    describe("getting critters", () => {
      it("returns many critters", async () => {
        const critters = await getAllCritters();
        expect.assertions(1);
        expect(critters.length).toBeGreaterThan(1);
      });
      it("returns just one critter", async () => {
        const c = await createTempCritter();
        const critter = await getCritterById(c.critter_id);
        expect.assertions(1);
        expect(critter?.critter_id).toBe(c.critter_id);
      });
      it("returns one critter matching the WLH ID", async () => {
        const c = await createTempCritter();
        const critters = await getCritterByWlhId(c.wlh_id as string);
        expect.assertions(2);
        expect(critters?.length).toBeGreaterThanOrEqual(1);
        expect(critters?.[0].wlh_id).toBe("TEST");
      });
    });
    describe("modifying critters", () => {
      it("updates a critter with the specified value", async () => {
        const c = await createTempCritter();
        const critter = await updateCritter(c.critter_id, {
          animal_id: "macaroni",
        });
        expect.assertions(2);
        expect(critter.wlh_id).toBe("TEST");
        expect(critter.animal_id).toBe("macaroni");
      });
      it("deletes a critter with the specified id", async () => {
        const c = await createTempCritter();
        await deleteCritter(c.critter_id);
        const deleted = await prisma.critter.findFirst({
          where: { critter_id: c.critter_id },
        });
        expect(deleted).toBeNull();
      });
    });
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
        const c = await obtainCritterTemplate();
        const res = await request.post("/api/critters/create").send(c);
        expect.assertions(2);
        expect(res.status).toBe(201);
        expect(res.body.wlh_id).toBe("TEST");
      });
      it("should return 400 if trying to create with bad value type", async () => {
        const c = await obtainCritterTemplate();
        const res = await request
          .post("/api/critters/create")
          .send({ taxon_id: c.taxon_id, sex: 123 });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
    });
    describe("GET /api/critters?wlh_id={wlh_id}", () => {
      it("should return status 200 and a valid critter", async () => {
        const res = await request.get("/api/critters?wlh_id=TEST");
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
      it("should return status 404 if searching bad wlh id", async () => {
        const res = await request.get("/api/critters?wlh_id=WHAT");
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("GET /api/critters/:id", () => {
      it("should return status 200", async () => {
        const c = await createTempCritter();
        const res = await request.get("/api/critters/" + c.critter_id);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });
      it("should return status 404 when critter id is not found", async () => {
        const res = await request.get("/api/critters/" + randomUUID());
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("PUT /api/critters/:id", () => {
      it("should return status 200, and update the critter", async () => {
        const c = await createTempCritter();
        const res = await request
          .put("/api/critters/" + c.critter_id)
          .send({ animal_id: "Banana" });
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.animal_id).toBe("Banana");
      });
      it("should return status 400 if you try to modify with a bad value type", async () => {
        const c = await createTempCritter();
        const res = await request
          .put("/api/critters/" + c.critter_id)
          .send({ sex: 1234 });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
      it("should return status 404 when critter id is not found", async () => {
        const res = await request.delete("/api/critters/" + randomUUID());
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
    describe("DELETE /api/critters/:id", () => {
      it("should return status 200 and delete the critter", async () => {
        const c = await createTempCritter();
        const res = await request.delete("/api/critters/" + c.critter_id);
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body.wlh_id).toBe("TEST");
      });
      it("should return status 404 when critter id is not found", async () => {
        const res = await request.delete("/api/critters/" + randomUUID());
        expect.assertions(1);
        expect(res.status).toBe(404);
      });
    });
  });
});

afterAll(async () => {
  for (const c of tempCritters) {
    const exists = await prisma.critter.findFirst({
      where: { critter_id: c.critter_id },
    });
    if (exists) {
      await prisma.critter.delete({ where: { critter_id: c.critter_id } });
    }
  }
});
