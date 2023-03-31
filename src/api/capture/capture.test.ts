import { capture, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma, request } from "../../utils/constants";
import { createCapture, deleteCapture, getAllCaptures, getCaptureByCritter, getCaptureById, updateCapture } from "./capture.service";

const tempCaptures: capture[] = [];

const obtainCaptureTemplate = async (): Promise<Prisma.captureUncheckedCreateInput> => {
  const critter = await prisma.critter.findFirst();
  const capture_location = await prisma.location.findFirst();
  if(!critter || !capture_location) throw Error('No critter.')
  return {
    critter_id: critter.critter_id,
    capture_location_id: capture_location.location_id,
    release_location_id: capture_location.location_id,
    capture_timestamp: new Date()
  }
}

const createTempCapture = async (): Promise<capture> => {
  const c = await prisma.capture.create({
    data: {
      ...(await obtainCaptureTemplate())
    }
  });
  tempCaptures.push(c);
  return c;
}

describe("API: Critter", () => {
  describe("SERVICES", () => {
    describe("creating captures", () => {
      it("should create one capture", async () => {
        const m = await obtainCaptureTemplate();
        const result = await createCapture({...m, capture_timestamp: new Date(), release_timestamp: new Date()});
        expect.assertions(1);
        expect(result).not.toBeNull();
      })
    })
    describe("getting captures", () => {
      it("returns all captures", async () => {
        const result = await getAllCaptures();
        expect.assertions(1);
        expect(result.length).toBeGreaterThanOrEqual(1);
      });
      it("should get one capture", async () => {
        const m = await createTempCapture();
        const result = await getCaptureById(m.capture_id);
        expect.assertions(1);
        expect(result?.capture_id).toBe(m.capture_id);
      });
      it("should get an array of captures from critter id", async () => {
        const critter = await prisma.critter.findFirstOrThrow();
        const result = await getCaptureByCritter(critter.critter_id);
        expect.assertions(1);
        expect(result?.length).toBeGreaterThanOrEqual(1);
      })
    });
    describe("modifying captures", () => {
      it("modifies the capture", async () => {
        const m = await createTempCapture();
        const result = await updateCapture(m.capture_id, {capture_comment: 'banana'});
        expect.assertions(1);
        expect(result?.capture_comment).toBe('banana');
      });
      it("deletes a capture", async () => {
        const m = await createTempCapture();
        const result = await deleteCapture(m.capture_id);
        expect.assertions(2);
        expect(result?.capture_id).toBe(m.capture_id);
        const exists = await prisma.capture.findUnique({
          where: {
            capture_id: m.capture_id
          }
        });
        expect(exists).toBeNull();
      });
    });
  });
  describe("ROUTERS", () => {
    describe("POST /api/critters/create", () => {
      it("should return status 201", async () => {
        expect.assertions(1);
        const res = await request.post("/api/captures/create").send({
          ...(await obtainCaptureTemplate())
        });
        expect(res.status).toBe(201);
      });
      /*it("should 409 if the capture exists", async () => {
        expect.assertions(1);
        const res = await request.post("/api/captures/create").send(dummyCapture);
        expect(res.status).toBe(409);
      });*/
    })
    describe("GET /api/critters", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.get("/api/captures/");
        expect(res.status).toBe(200);
      });
    });
    describe("GET /api/captures/:capture_id", () => {
      it("should get one capture", async () => {
        const m = await createTempCapture();
        expect.assertions(1);
        const res = await request.get("/api/captures/" + m.capture_id)
        expect(res.status).toBe(200);
      })
      it("should 404", async () => {
        expect.assertions(1);
        const res = await request.get("/api/captures/deadbeef-dead-dead-dead-deaddeafbeef");
        expect(res.status).toBe(404); 
      })
    });
    describe("GET /api/captures/critter/:critter_id", () => {
      it("should return status 200 with an array of captures", async () => {
        expect.assertions(2);
        const critter = await prisma.critter.findFirstOrThrow();
        const res = await request.get("/api/captures/critter/" + critter.critter_id);
        console.log('res was ' + JSON.stringify(res, null, 2));
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
      it("should 404 when trying to get a bad critter", async () => {
        expect.assertions(1);
        const res = await request.get("/api/captures/critter/deadbeef-dead-dead-dead-deaddeafbeef");
        expect(res.status).toBe(404); 
      })
    });
    describe("PUT /api/captures/:capture_id", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const m = await createTempCapture();
        const res = await request.put("/api/captures/" + m.capture_id).send({capture_comment: 'eee'});
        expect(res.status).toBe(200);
      });
      it("should 404 if the capture is not found", async () => {
        expect.assertions(1);
        const res = await request.put("/api/captures/deadbeef-dead-dead-dead-deaddeafbeef");
        expect(res.status).toBe(404); 
      })
    });
    describe("DELETE /api/captures/:capture_id", () => {
      it("should return status 200", async () => {
        const m = await createTempCapture();
        expect.assertions(1);
        const res = await request.delete("/api/captures/" + m.capture_id);
        expect(res.status).toBe(200);
      });
      it("should 404 if there is no capture to delete", async () => {
        expect.assertions(1);
        const res = await request.delete("/api/captures/deadbeef-dead-dead-dead-deaddeafbeef");
        expect(res.status).toBe(404); 
      });
    })
  });
});

afterAll(async () => {
  for(const c of tempCaptures) {
    if((await prisma.capture.findUnique({ where: { capture_id: c.capture_id}}))) {
      await prisma.capture.delete({
        where: {
          capture_id: c.capture_id
        }
      })
    }
  }
})
