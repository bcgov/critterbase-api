import { request } from "../../utils/constants";
import { createUser, getUsers } from "./user.service";
import type { user } from "@prisma/client";
import { uuidRegex } from "../../utils/middleware";
import { randomInt } from "crypto";


function isUser(user: any): user is user {
  return (
    typeof user.user_id === "string" && uuidRegex.test(user.user_id) &&
    typeof user.system_user_id === "string" &&
    typeof user.system_name === "string" &&
    (user.keycloak_uuid === null || typeof user.keycloak_uuid === "string") &&
    typeof user.create_user === "string" && uuidRegex.test(user.create_user) &&
    typeof user.update_user === "string" && uuidRegex.test(user.update_user) &&
    user.create_timestamp instanceof Date &&
    user.update_timestamp instanceof Date
  );
}


describe("API: User", () => {
  describe("SERVICES", () => {
    describe("createUser()", () => {
      it("returns a user",async () => {
        const system_user_id = randomInt(99999999).toString();
        const user = await createUser({system_name:"TEST_USER", system_user_id:system_user_id});
        expect.assertions(1);
        expect(isUser(user)).toBe(true);
      })
    });
    describe("getUsers()", () => {
      it("returns an array", async () => {
        const users = await getUsers();
        expect.assertions(2);
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);
      });

      it("returns users with correct properties", async () => {
        const users = await getUsers();
        expect.assertions(users.length);
        for (const user of users) {
          expect(isUser(user)).toBe(true);
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
        const res = await request.get("/api/users");
        const users = res.body;
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
});
