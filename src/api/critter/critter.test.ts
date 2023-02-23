import { request } from "../../utils/test_helpers";
import { getCritter } from "./critter.service";

describe("Critter", () => {
  describe("SERVICES", () => {
    describe("getCritter()", () => {
      it("returns a Critter", async () => {
        const critter = getCritter();
        expect.assertions(1);
        expect(critter).toStrictEqual({
          critter_id: 1,
          species: "caribou",
          location: "bc",
        });
      });
      it("has a critter_id", async () => {
        const critter = getCritter();
        expect.assertions(1);
        expect(critter.critter_id).toBeDefined();
      });
    });
  });
  describe("ROUTERS", () => {
    describe("GET /api/critters", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.get("/api/critters");
        expect(res.status).toBe(200);
      });
    });
  });
});
