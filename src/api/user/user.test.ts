import { request } from "../../utils/constants";
import { createUser, deleteUser, getUser, getUserBySystemId, getUsers, updateUser, upsertUser } from "./user.service";
import type { Prisma, user } from "@prisma/client";
import { uuidRegex } from "../../utils/middleware";
import { randomInt, randomUUID } from "crypto";


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

function newUser(): Prisma.userCreateInput {
  const num = randomInt(99999999);
  return {
    system_user_id: num.toString(),
    system_name: `TEST_USER_${num}`,
    keycloak_uuid: null,
  };
}

async function cleanup() {
  const users = await getUsers();
  const testUserIds = users
    .filter((user) => user.system_name.startsWith("TEST_USER_"))
    .map((user) => user.user_id);
  await Promise.all(testUserIds.map(deleteUser));
}

describe("API: User", () => {
  describe("SERVICES", () => {
    describe("createUser()", () => {
      it("returns a user", async () => {
      const mockUser = newUser();
      const returnedUser = await createUser(mockUser);
        expect.assertions(1);
        expect(isUser(returnedUser)).toBe(true);
      });
      it("returned user matches the input", async () => {
        const mockUser = newUser();
        const returnedUser = await createUser(mockUser);
        expect.assertions(1);
        expect(returnedUser).toMatchObject(mockUser);
      })
    });
    describe("upsertUser()", () => {
      it("returns a user", async () => {
        const mockUser = newUser();
        const returnedUser = await upsertUser(mockUser);
          expect.assertions(1);
          expect(isUser(returnedUser)).toBe(true);
        });
        it("returned user matches the input", async () => {
          const mockUser = newUser();
          const returnedUser = await upsertUser(mockUser);
          expect.assertions(1);
          expect(returnedUser).toMatchObject(mockUser);
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
    describe("getUser()", () => {
      it("returns a user when given a valid user ID", async () => {
        const mockUser = newUser();
        const createdUser = await createUser(mockUser);
        const returnedUser = await getUser(createdUser.user_id);
        expect.assertions(2);
        expect(isUser(returnedUser)).toBe(true);
        expect(returnedUser).toMatchObject(createdUser);
      });

      it("returns null when given an invalid system user ID", async () => {
        const returnedUser = await getUser(randomUUID());
        expect.assertions(1);
        expect(returnedUser).toBeNull();
      });
    });
    
    describe("getUserBySystemId()", () => {
      it("returns a user when given a valid system user ID", async () => {
        const mockUser = newUser();
        const createdUser = await createUser(mockUser);
        const returnedUser = await getUserBySystemId(createdUser.system_user_id);
        expect.assertions(2);
        expect(isUser(returnedUser)).toBe(true);
        expect(returnedUser).toMatchObject(createdUser);
      });
    
      it("returns null when given an invalid system user ID", async () => {
        const returnedUser = await getUserBySystemId("invalid_system_user_id");
        expect.assertions(1);
        expect(returnedUser).toBeNull();
      });
    });
    describe("updateUser()", () => {
      it("returns a user with the updated data", async () => {
        const mockUser = newUser();
        const createdUser = await createUser(mockUser);
        const updateData: Prisma.userUpdateInput = {
          system_name: mockUser.system_name + "_UPDATED",
        };
        const updatedUser = await updateUser(createdUser.user_id, updateData);
        expect.assertions(2);
        expect(isUser(updatedUser)).toBe(true);
        expect(updatedUser).toMatchObject({
          ...createdUser,
          ...updateData,
          update_user: updatedUser.update_user, // ignore, as it will be different
          update_timestamp: updatedUser.update_timestamp, // ignore, as it will be different
        });
      });
    });

    describe("deleteUser()", () => {
      it("deletes a user", async () => {
        const mockUser = newUser();
        const createdUser = await createUser(mockUser);
        const deletedUser = await deleteUser(createdUser.user_id);
        expect.assertions(3);
        expect(isUser(deletedUser)).toBe(true);
        expect(deletedUser).toMatchObject(createdUser);
        const returnedUser = await getUser(createdUser.user_id);
        expect(returnedUser).toBeNull();
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

  afterAll(async () => {
    await cleanup();
  });
  
});
