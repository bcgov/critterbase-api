import { request } from "../../utils/utils.test";
import { getUsers } from "./user.service";

describe("API: User", () => {
  describe("SERVICES", () => {
    describe("getUsers()", () => {
      it("returns an array of users", async () => {
        const users = await getUsers();
        expect.assertions(2);
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);
      });

      it("returns users with correct properties", async () => {
        const users = await getUsers();
        expect.assertions(users.length * 8);
        for (const user of users) {
          expect(user.user_id).toBeDefined();
          expect(user.system_user_id).toBeDefined();
          expect(user.system_name).toBeDefined();
          expect(user.keycloak_uuid).toBeDefined();
          expect(user.create_user).toBeDefined();
          expect(user.update_user).toBeDefined();
          expect(user.create_timestamp).toBeDefined();
          expect(user.update_timestamp).toBeDefined();
        }
      });
    });
  });

  describe("ROUTERS", () => {
    describe("GET /api/users", () => {
      it("should return status 200", async () => {
        expect.assertions(1);
        const res = await request.get("/api/users");
        expect(res.status).toBe(200);
      });

      it("should return an array of users", async () => {
        expect.assertions(2);
        const res = await request.get("/api/users");
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
      });

      it("should return users with correct properties", async () => {
        expect.assertions(9);
        const res = await request.get("/api/users");
        const users = res.body;
        for (const user of users) {
          expect(user.user_id).toBeDefined();
          expect(user.system_user_id).toBeDefined();
          expect(user.system_name).toBeDefined();
          expect(user.keycloak_uuid).toBeDefined();
          expect(user.create_user).toBeDefined();
          expect(user.update_user).toBeDefined();
          expect(user.create_timestamp).toBeDefined();
          expect(user.update_timestamp).toBeDefined();
        }
      });
    });
  });
});
