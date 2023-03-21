import { prisma, request } from "../../utils/constants";
import {
  getAllCollectionUnits,
  getCollectionUnitById,
  getCollectionUnitsByCritterId,
  updateCollectionUnit,
  createCollectionUnit,
  deleteCollectionUnit,
} from "./collectionUnit.service";
import type { Prisma, critter_collection_unit, critter } from "@prisma/client";
import { randomInt, randomUUID } from "crypto";

function get_random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

let dummyCritter: critter;
let dummyCollectionUnit: critter_collection_unit;
let dummyCollectionUnitInput: Prisma.critter_collection_unitUncheckedCreateInput;
let dummyCollectionUnitKeys: string[];

/**
 * * Creates a new critter_collection_unit object that references an existing critter and critter_collection_unit location
 */
async function newCollectionUnit(): Promise<Prisma.critter_collection_unitUncheckedCreateInput> {
  const dummyCritterId: string | undefined = get_random(
    await prisma.critter_collection_unit.findMany({
      select: {
        critter_id: true,
      },
    })
  )?.critter_id;
  if (!dummyCritterId) throw Error("Could not get critter_id for dummy.");
  const dummyCollectionUnitId: string | undefined = get_random(
    await prisma.critter_collection_unit.findMany({
      select: {
        collection_unit_id: true,
      },
    })
  )?.collection_unit_id;
  if (!dummyCollectionUnitId)
    throw Error(
      "Could not get taxon_critter_collection_unit_body_location_id for dummy."
    );
  const dummyCollectionUnit: Prisma.critter_collection_unitUncheckedCreateInput =
    {
      critter_id: dummyCritter.critter_id,
      collection_unit_id: dummyCollectionUnitId,
    };
  return dummyCollectionUnit;
}

beforeAll(async () => {
  // Sets a global dummy critter_collection_unit to reduce complexity on similar tests
  // dummyUser is needed to keep track of other dummy entries created for these tests
  const dummyTaxon = (
    await prisma.critter.findFirst({ select: { taxon_id: true } })
  )?.taxon_id;
  if (dummyTaxon) {
    dummyCritter = await prisma.critter.create({
      data: {
        taxon_id: dummyTaxon,
        sex: "Unknown",
        animal_id: `TEST_CRITTER_${randomInt(99999999)}`,
      },
    });
  }
  dummyCollectionUnitInput = await newCollectionUnit();
  dummyCollectionUnit = await prisma.critter_collection_unit.create({
    data: dummyCollectionUnitInput,
  });
  dummyCollectionUnitKeys = Object.keys(dummyCollectionUnit);
});

describe("API: Collection Unit", () => {
  describe("SERVICES", () => {
    describe("createCollectionUnit()", () => {
      it("creates a new critter_collection_unit", async () => {
        const newCollectionUnitInput = await newCollectionUnit();
        const critter_collection_unit = await createCollectionUnit(
          newCollectionUnitInput
        );
        expect.assertions(2);
        expect(critter_collection_unit.critter_id).toBe(
          newCollectionUnitInput.critter_id
        );
        expect(critter_collection_unit.collection_unit_id).toBe(
          newCollectionUnitInput.collection_unit_id
        );
      });
    });

    describe("getAllCollectionUnits()", () => {
      it("returns an array of critter_collection_units", async () => {
        const critter_collection_units = await getAllCollectionUnits();
        expect.assertions(2);
        expect(critter_collection_units).toBeInstanceOf(Array);
        expect(critter_collection_units.length).toBeGreaterThan(0);
      });

      it("returns critter_collection_units with correct properties", async () => {
        const critter_collection_units = await getAllCollectionUnits();
        expect.assertions(
          critter_collection_units.length * dummyCollectionUnitKeys.length
        );
        for (const critter_collection_unit of critter_collection_units) {
          for (const key of dummyCollectionUnitKeys) {
            expect(critter_collection_unit).toHaveProperty(key);
          }
        }
      });
    });

    describe("getCollectionUnitById()", () => {
      it("returns the expected critter_collection_unit", async () => {
        const critter_collection_unit = await getCollectionUnitById(
          dummyCollectionUnit.critter_collection_unit_id
        );
        expect.assertions(1);
        expect(critter_collection_unit).toStrictEqual(dummyCollectionUnit);
      });
    });

    describe("getCollectionUnitsByCritterId()", () => {
      it("returns an array of critter_collection_units with the expected critter ID", async () => {
        // create another record with the same critter_id
        const critter_collection_unitInput = await newCollectionUnit();
        await prisma.critter_collection_unit.create({
          data: {
            ...critter_collection_unitInput,
            critter_id: dummyCollectionUnit.critter_id,
          },
        });
        const returnedCollectionUnits = await getCollectionUnitsByCritterId(
          dummyCollectionUnit.critter_id
        );
        expect.assertions(1 + returnedCollectionUnits.length);
        expect(returnedCollectionUnits.length).toBeGreaterThanOrEqual(2); // At least two critter_collection_units tied to this critter
        for (const critter_collection_unit of returnedCollectionUnits) {
          expect(critter_collection_unit.critter_id).toBe(
            dummyCollectionUnit.critter_id
          );
        }
      });
    });

    describe("updateCollectionUnit()", () => {
      it("updates a critter_collection_unit", async () => {
        const critter_collection_unit =
          await prisma.critter_collection_unit.create({
            data: await newCollectionUnit(),
          });
        const newData = (await newCollectionUnit())?.collection_unit_id;
        const updatedCollectionUnit = await updateCollectionUnit(
          critter_collection_unit.critter_collection_unit_id,
          { collection_unit_id: newData }
        );
        expect.assertions(2);
        expect(updatedCollectionUnit).toStrictEqual({
          ...critter_collection_unit,
          ...{ collection_unit_id: newData },
          update_timestamp: updatedCollectionUnit.update_timestamp, // Ignore this field as it will be different
        });
        expect(
          updatedCollectionUnit.update_timestamp ===
            critter_collection_unit.update_timestamp
        ).toBeFalsy();
      });
    });

    describe("deleteCollectionUnit()", () => {
      it("deletes a critter_collection_unit", async () => {
        const critter_collection_unit =
          await prisma.critter_collection_unit.create({
            data: await newCollectionUnit(),
          });
        const deletedCollectionUnit = await deleteCollectionUnit(
          critter_collection_unit.critter_collection_unit_id
        );
        const critter_collection_unitCheck =
          await prisma.critter_collection_unit.findUnique({
            where: {
              critter_collection_unit_id:
                critter_collection_unit.critter_collection_unit_id,
            },
          });
        expect.assertions(2);
        expect(deletedCollectionUnit).toStrictEqual(critter_collection_unit);
        expect(critter_collection_unitCheck).toBeNull();
      });
    });
  });

  describe("ROUTERS", () => {
    describe("GET /api/collection_unit", () => {
      it("returns status 200", async () => {
        const res = await request.get("/api/collection_units");
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns an array", async () => {
        const res = await request.get("/api/collection_units");
        expect.assertions(1);
        expect(res.body).toBeInstanceOf(Array);
      });

      it("returns collection_units with correct properties", async () => {
        const res = await request.get("/api/collection_units");
        const critter_collection_units = res.body;
        expect.assertions(
          critter_collection_units.length * dummyCollectionUnitKeys.length
        );
        for (const critter_collection_unit of critter_collection_units) {
          for (const key of dummyCollectionUnitKeys) {
            expect(critter_collection_unit).toHaveProperty(key);
          }
        }
      });
    });

    describe("POST /api/collection_unit/create", () => {
      it("returns status 201", async () => {
        const collectionUnit = await newCollectionUnit();
        const res = await request
          .post("/api/collection_units/create")
          .send(collectionUnit);
        expect.assertions(1);
        expect(res.status).toBe(201);
      });

      it("returns a collection unit", async () => {
        const collectionUnit = await newCollectionUnit();
        const res = await request
          .post("/api/collection_units/create")
          .send(collectionUnit);
        const returnedCollectionUnits = res.body;
        expect.assertions(dummyCollectionUnitKeys.length);
        for (const key of dummyCollectionUnitKeys) {
          expect(returnedCollectionUnits).toHaveProperty(key);
        }
      });

      it("strips invalid fields from data", async () => {
        const collectionUnit = await newCollectionUnit();
        const res = await request
          .post("/api/collection_units/create")
          .send({ ...collectionUnit, invalidField: "qwerty123" });
        expect.assertions(2);
        expect(res.status).toBe(201);
        expect(res.body).not.toHaveProperty("invalidField");
      });

      it("returns status 400 when data is missing required fields", async () => {
        const collectionUnit = await newCollectionUnit();
        const res = await request.post("/api/collection_units/create").send({
          // left out required collection_unit_id field
          critter_id: collectionUnit.critter_id,
        });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/collection_units/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request.get(`/api/collection_units/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const res = await request.get(
          `/api/collection_units/${dummyCollectionUnit.critter_collection_unit_id}`
        );
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns a marking", async () => {
        const res = await request.get(
          `/api/collection_units/${dummyCollectionUnit.critter_collection_unit_id}`
        );
        expect.assertions(dummyCollectionUnitKeys.length);
        for (const key of dummyCollectionUnitKeys) {
          expect(res.body).toHaveProperty(key);
        }
      });
    });

    describe("PATCH /api/collection_units/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request.patch(
          `/api/collection_units/${randomUUID()}`
        );
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const res = await request
          .patch(
            `/api/collection_units/${dummyCollectionUnit.critter_collection_unit_id}`
          )
          .send({ critter_id: dummyCollectionUnit.critter_id });
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns a collection unit", async () => {
        const res = await request
          .patch(
            `/api/collection_units/${dummyCollectionUnit.critter_collection_unit_id}`
          )
          .send({ critter_id: dummyCollectionUnit.critter_id });
        expect.assertions(dummyCollectionUnitKeys.length);
        for (const key of dummyCollectionUnitKeys) {
          expect(res.body).toHaveProperty(key);
        }
      });

      it("returns status 400 when data is empty", async () => {
        const res = await request.patch(
          `/api/collection_units/${dummyCollectionUnit.critter_collection_unit_id}`
        );
        expect.assertions(1);
        expect(res.status).toBe(400);
      });

      it("strips invalid fields from data", async () => {
        const res = await request
          .patch(
            `/api/collection_units/${dummyCollectionUnit.critter_collection_unit_id}`
          )
          .send({
            critter_id: dummyCollectionUnit.critter_id,
            invalidField: "qwerty123",
          });
        expect.assertions(2);
        expect(res.status).toBe(200);
        expect(res.body).not.toHaveProperty("invalidField");
      });
    });

    describe("DELETE /api/collection_units/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request.delete(
          `/api/collection_units/${randomUUID()}`
        );
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const collection_unit = await prisma.critter_collection_unit.create({
          data: await newCollectionUnit(),
        });
        const res = await request.delete(
          `/api/collection_units/${collection_unit.critter_collection_unit_id}`
        );
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns collection unit deleted message", async () => {
        const collection_unit = await prisma.critter_collection_unit.create({
          data: await newCollectionUnit(),
        });
        const res = await request.delete(
          `/api/collection_units/${collection_unit.critter_collection_unit_id}`
        );
        expect.assertions(1);
        expect(res.body).toStrictEqual(
          `CollectionUnit ${collection_unit.critter_collection_unit_id} has been deleted`
        );
      });
    });
  });
});

afterAll(async () => {
  await prisma.critter_collection_unit.deleteMany({
    where: { critter_id: dummyCritter.critter_id },
  });
  await prisma.critter.delete({
    where: { critter_id: dummyCritter.critter_id },
  });
});
