import { capture, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma, request } from "../../utils/constants";
import { createCapture, deleteCapture, getAllCaptures, getCaptureByCritter, getCaptureById, updateCapture } from "./capture.service";

let dummyCapture;
let captureUUID;
let critterUUID;
beforeAll(async () => {
  captureUUID = await randomUUID();
  const critter = await prisma.critter.findFirst();
  const capture_location = await prisma.location.findFirst();
  if(!critter || !capture_location) throw Error('No critter.')
  critterUUID = critter.critter_id;
  dummyCapture = {
    capture_id: captureUUID,
    critter_id: critter.critter_id,
    capture_location_id: capture_location.location_id,
    release_location_id: capture_location.location_id,
    capture_timestamp: new Date()
  }
})

describe("API: Critter", () => {
  describe("SERVICES", () => {
    describe("creating captures", () => {
      it("should create one capture", async () => {
        const result = await createCapture(dummyCapture);
        expect.assertions(1);
        expect(result?.capture_id).toBe(dummyCapture.capture_id);
      })
    })
    describe("getting captures", () => {
      it("returns all captures", async () => {
        const result = await getAllCaptures();
        expect.assertions(1);
        expect(result.length).toBeGreaterThanOrEqual(1);
      });
      it("should get one capture", async () => {
        const result = await getCaptureById(captureUUID);
        expect.assertions(1);
        expect(result?.capture_id).toBe(captureUUID);
      });
      it("should get an array of captures from critter id", async () => {
        const result = await getCaptureByCritter(critterUUID);
        expect.assertions(1);
        expect(result?.length).toBeGreaterThanOrEqual(1);
      })
    });
    describe("modifying captures", () => {
      it("modifies the capture", async () => {
        const result = await updateCapture(captureUUID, {capture_comment: 'banana'});
        expect.assertions(1);
        expect(result?.capture_comment).toBe('banana');
      });
      it("deletes a capture", async () => {
        const result = await deleteCapture(captureUUID);
        expect.assertions(2);
        expect(result?.capture_id).toBe(captureUUID);
        const exists = await prisma.capture.findUnique({
          where: {
            capture_id: captureUUID
          }
        });
        expect(exists).toBeNull();
      });
    });
  });
  describe("ROUTERS", () => {
    describe("POST /api/critters/create", () => {
      it("should return status 201", async () => {
        expect.assertions(2);
        const res = await request.post("/api/captures/create").send(dummyCapture);
        expect(res.status).toBe(201);
        expect(res.body.capture_id).toBe(captureUUID);
      });
      it("should 409 if the capture exists", async () => {
        expect.assertions(1);
        const res = await request.post("/api/captures/create").send(dummyCapture);
        expect(res.status).toBe(409);
      });
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
        expect.assertions(1);
        const res = await request.get("/api/captures/" + captureUUID)
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
        const res = await request.get("/api/captures/critter/" + critterUUID);
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
        const res = await request.put("/api/captures/" + captureUUID).send({capture_comment: 'eee'});
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
        expect.assertions(1);
        const res = await request.delete("/api/captures/" + captureUUID);
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
  const exists = await prisma.capture.findFirst({
    where: {
      capture_id: captureUUID
    }
  })
  if(exists) {
    await prisma.capture.delete({
      where: {
        capture_id: captureUUID
      }
    })
  }
})
