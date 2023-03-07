import { request } from "../../utils/utils.test";
import { getUsers } from "./user.service";

describe("API: User", () => {
  describe("SERVICES", () => {
    describe("getUser()", () => {
      it("returns a User", async () => {
        const user = getUsers();
        expect.assertions(1);
        expect(user).toStrictEqual({
          user_id: 1,
          species: "caribou",
          location: "bc",
        });
      });
      // it("has a user_id", async () => {
      //   const user = getUsers();
      //   expect.assertions(1);
      //   expect(user.user_id).toBeDefined();
      // });
    });
  });
  describe("ROUTERS", () => {
    describe("GET /api/users", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.get("/api/users");
        expect(res.status).toBe(200);
      });
    });
  });
});
