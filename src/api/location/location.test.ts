import { request } from "../../utils/constants";

describe("API: Location", () => {
  describe("SERVICES", () => {
    // describe("getCritter()", () => {
    //   it("returns a Critter", async () => {
    //     expect(true);
    //     // const critter = getAllCritters();
    //     // expect.assertions(1);
    //     // expect(critter).toStrictEqual({
    //     //   critter_id: 1,
    //     //   species: "caribou",
    //     //   location: "bc",
    //     // });
    //   });
    //   // it("has a critter_id", async () => {
    //   //   const critter = getCritters();
    //   //   expect.assertions(1);
    //   //   expect(critter.critter_id).toBeDefined();
    //   // });
    // });
  });
  describe("ROUTERS", () => {
    describe("GET /api/locations", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.get(
          "/api/locations/723327f7-6667-43a2-964b-71fa2639b748"
        );
        expect(res.status).toBe(200);
        console.log(res.body);
      });
    });
  });
});
