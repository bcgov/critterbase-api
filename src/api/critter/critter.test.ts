import { request } from "../../utils/constants";
import { getCritters } from "./critter.service";

describe("API: Critter", () => {
  describe("SERVICES", () => {
    describe("getCritter()", () => {
      it("returns a Critter", async () => {
        const critter = getCritters();
        expect.assertions(1);
        expect(critter).toStrictEqual({
          critter_id: 1,
          species: "caribou",
          location: "bc",
        });
      });
      // it("has a critter_id", async () => {
      //   const critter = getCritters();
      //   expect.assertions(1);
      //   expect(critter.critter_id).toBeDefined();
      // });
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
