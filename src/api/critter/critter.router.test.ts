import { makeApp } from "../../app";
import supertest from "supertest";

const id = "3277ea2a-38ee-4aa4-a9af-b2c40d8cb940";

const mockCritterService = {
  getAllCritters: jest.fn(),
  getMultipleCrittersByIds: jest.fn(),
  getCritterById: jest.fn(),
  getAllCrittersOrCrittersWithWlhId: jest.fn(),
  updateCritter: jest.fn(),
  createCritter: jest.fn(),
  findSimilarCritters: jest.fn(),
};

const request = supertest(
  makeApp({ critterService: mockCritterService } as any),
);

describe("Critter Router", () => {
  describe("GET critter/ - get all critters or critters with matching wlh_id", () => {
    it("should respond with status 200 and return response", async () => {
      mockCritterService.getAllCrittersOrCrittersWithWlhId.mockResolvedValueOnce(
        true,
      );
      const res = await request.get("/api/critters");

      expect(res.status).toBe(200);
      expect(res.body).toBe(true);
    });

    it("should respond 200 and pass wlh_id to service function", async () => {
      mockCritterService.getAllCrittersOrCrittersWithWlhId.mockResolvedValueOnce(
        true,
      );
      const res = await request.get("/api/critters").query({ wlh_id: "wlhid" });

      expect(
        mockCritterService.getAllCrittersOrCrittersWithWlhId.mock.calls[0][0],
      ).toBe("wlhid");
      expect(res.status).toBe(200);
      expect(res.body).toBe(true);
    });
  });

  describe("POST critter/ - get all critters with matching critter_id's", () => {
    it("should respond with status 200 and return response", async () => {
      mockCritterService.getMultipleCrittersByIds.mockResolvedValueOnce(true);
      const res = await request
        .post("/api/critters")
        .send({ critter_ids: [id] });

      expect(res.status).toBe(200);
      expect(res.body).toBe(true);
      expect(
        mockCritterService.getMultipleCrittersByIds.mock.calls[0][0],
      ).toStrictEqual([id]);
    });

    describe("POST critter/create/ - create a critter", () => {
      it("should respond with status 201 and return response", async () => {
        mockCritterService.createCritter.mockResolvedValueOnce(true);
        const payload = { sex: "Male", itis_tsn: 1 };
        const res = await request.post("/api/critters/create").send(payload);

        expect(mockCritterService.createCritter.mock.calls[0][0]).toStrictEqual(
          payload,
        );
        expect(res.status).toBe(201);
        expect(res.body).toBe(true);
      });
    });

    describe("GET critter/:id - get a critter by id", () => {
      it("should respond with status 200 and return response", async () => {
        mockCritterService.getCritterById.mockResolvedValueOnce(true);
        const res = await request
          .get(`/api/critters/${id}`)
          .query({ format: "asSelect" });

        expect(
          mockCritterService.getCritterById.mock.calls[0][0],
        ).toStrictEqual(id);
        expect(
          mockCritterService.getCritterById.mock.calls[0][1],
        ).toStrictEqual("asSelect");
        expect(res.status).toBe(200);
        expect(res.body).toBe(true);
      });
    });

    describe("PATCH critter/:id - update a critter by id", () => {
      it("should respond with status 201 and return response", async () => {
        mockCritterService.updateCritter.mockResolvedValueOnce(true);
        const res = await request.patch(`/api/critters/${id}`);

        expect(mockCritterService.updateCritter.mock.calls[0][0]).toStrictEqual(
          id,
        );
        expect(res.status).toBe(201);
        expect(res.body).toBe(true);
      });
    });

    describe("POST critter/unique - find unique critters by attributes", () => {
      it("should respond with status 200 and return response", async () => {
        mockCritterService.findSimilarCritters.mockResolvedValueOnce(true);
        const payload = { critter: { wlh_id: "wlhid" } };
        const res = await request.post(`/api/critters/unique`).send(payload);

        expect(
          mockCritterService.findSimilarCritters.mock.calls[0][0],
        ).toStrictEqual(payload);
        expect(res.status).toBe(200);
        expect(res.body).toBe(true);
      });
    });
  });
});
