import { request, uuidRegex } from "../../utils/constants";
import {
  createUser,
  deleteUser,
  getUser,
  getUserBySystemId,
  getUsers,
  updateUser,
  upsertUser,
} from "./user.service";
import type { Prisma, user } from "@prisma/client";
import { randomInt, randomUUID } from "crypto";

const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * * Checks if an object matches the format for a user.
 * @param {*} user
 */
function isUser(user: any): user is user {
  const isUserId =
    typeof user.user_id === "string" && uuidRegex.test(user.user_id);
  const isSystemUserId = typeof user.system_user_id === "string";
  const isSystemUserName = typeof user.system_name === "string";
  const isUserKeycloak =
    user.keycloak_uuid === null || typeof user.keycloak_uuid === "string";
  const isCreateUser =
    typeof user.create_user === "string" && uuidRegex.test(user.create_user);
  const isUpdateUser =
    typeof user.update_user === "string" && uuidRegex.test(user.update_user);
  const isCreateDate =
    iso8601Regex.test(user.create_timestamp) ||
    user.create_timestamp instanceof Date;
  const isUpdateDate =
    iso8601Regex.test(user.update_timestamp) ||
    user.update_timestamp instanceof Date;

  return (
    isUserId &&
    isSystemUserId &&
    isSystemUserName &&
    isUserKeycloak &&
    isCreateUser &&
    isUpdateUser &&
    isCreateDate &&
    isUpdateDate
  );
}

/**
 * * Returns a randomly generated user that can be insterted to the database
 */
function newUser(): Prisma.userCreateInput {
  const num = randomInt(99999999);
  return {
    system_user_id: num.toString(),
    system_name: `TEST_USER_${num}`,
    keycloak_uuid: null,
  };
}

/**
 * * Removes all test generated users from the database
 */
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
      });
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
      });
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
        const returnedUser = await getUserBySystemId(
          createdUser.system_user_id
        );
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
      it("returns deleted user and removes user from database", async () => {
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
      it("returns status 200", async () => {
        expect.assertions(1);
        const res = await request.get("/api/users");
        expect(res.status).toBe(200);
      });

      it("returns an array", async () => {
        expect.assertions(1);
        const res = await request.get("/api/users");
        expect(res.body).toBeInstanceOf(Array);
      });

      it("returns users with correct properties", async () => {
        const res = await request.get("/api/users");
        const users = res.body;
        expect.assertions(users.length);
        for (const user of users) {
          expect(isUser(user)).toBe(true);
        }
      });
    });

    describe("POST /api/users/create", () => {
      it("returns status 201", async () => {
        expect.assertions(1);
        const res = await request.post("/api/users/create").send(newUser());
        expect(res.status).toBe(201);
      });

      it("returns a user", async () => {
        const res = await request.post("/api/users/create").send(newUser());
        const user = res.body;
        expect.assertions(1);
        expect(isUser(user)).toBe(true);
      });

      it("updates an existing user if the system_user_id already present", async () => {
        const res = await request.post("/api/users/create").send(newUser());
        const user = res.body;
        const res2 = await request
          .post("/api/users/create")
          .send({ ...newUser(), system_user_id: user.system_user_id });
        const user2 = res2.body;
        console.log(user, user2);
        expect.assertions(5);
        expect(user.system_user_id).toStrictEqual(user2.system_user_id);
        expect(user.user_id).toStrictEqual(user2.user_id);
        expect(user.system_name === user2.system_name).toBeFalsy(); //name was updated
        expect(user.create_timestamp).toStrictEqual(user2.create_timestamp);
        expect(user.update_timestamp === user2.update_timestamp).toBeFalsy(); //timestamp updated
      });

      it("returns status 400 when data contains invalid fields", async () => {
        const user = newUser();
        const res = await request
          .post("/api/users/create")
          .send({ ...user, invalidField: "qwerty123" });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });

      it("returns status 400 when data is missing required fields", async () => {
        const user = newUser();
        const res = await request.post("/api/users/create").send({
          // system_user_id is left out
          system_name: user.system_name,
          keycloak_uuid: user.keycloak_uuid,
        });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/users/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request.get(`/api/users/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const user = await createUser(newUser());
        const res = await request.get(`/api/users/${user.user_id}`);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns a user", async () => {
        const user = await createUser(newUser());
        const res = await request.get(`/api/users/${user.user_id}`);
        expect.assertions(1);
        expect(isUser(res.body)).toBe(true);
      });
    });

    describe("PUT /api/users/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request.put(`/api/users/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const user = await createUser(newUser());
        const res = await request.put(`/api/users/${user.user_id}`);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns a user", async () => {
        const user = await createUser(newUser());
        const res = await request.put(`/api/users/${user.user_id}`);
        expect.assertions(1);
        expect(isUser(res.body)).toBe(true);
      });

      it("returns status 409 when system_user_id already taken", async () => {
        const user1 = await createUser(newUser());
        const user2 = await createUser(newUser());
        const res = await request
          .put(`/api/users/${user2.user_id}`)
          .send({ system_user_id: user1.system_user_id });
        expect.assertions(1);
        expect(res.status).toBe(409);
      });
      
      it("returns status 400 when data contains invalid fields", async () => {
        const user = newUser();
        const res = await request
          .post("/api/users/create")
          .send({ ...user, invalidField: "qwerty123" });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
    });

    describe("DELETE /api/users/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request.delete(`/api/users/${randomUUID()}`);
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 200", async () => {
        const user = await createUser(newUser());
        const res = await request.delete(`/api/users/${user.user_id}`);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns user deleted message", async () => {
        const user = await createUser(newUser());
        const res = await request.delete(`/api/users/${user.user_id}`);
        expect.assertions(1);
        expect(res.body).toStrictEqual(`User ${user.user_id} has been deleted`);
      });
    });
  });

  afterAll(async () => {
    await cleanup();
  });
});