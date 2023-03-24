import { prisma, request } from "../../utils/constants";
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
import { UserCreateInput, UserUpdateInput } from "./user.types";

const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

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
function newUser(): UserCreateInput {
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
  let dummyUser: user;

  beforeAll(async () => {
    dummyUser = await prisma.user.create({ data: newUser() });
  });

  describe("SERVICES", () => {
    describe("createUser()", () => {
      it("returns a user", async () => {
        const returnedUser = await createUser(newUser());
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
        const returnedUser = await upsertUser(newUser());
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
        const returnedUser = await getUser(dummyUser.user_id);
        expect.assertions(2);
        expect(isUser(returnedUser)).toBe(true);
        expect(returnedUser).toMatchObject(dummyUser);
      });

      it("throws error when given an invalid user ID", async () => {
        expect.assertions(1);
        await expect(getUser(randomUUID())).rejects.toThrow();
      });      
    });

    describe("getUserBySystemId()", () => {
      it("returns a user when given a valid system user ID", async () => {
        const returnedUser = await getUserBySystemId(dummyUser.system_user_id);
        expect.assertions(2);
        expect(isUser(returnedUser)).toBe(true);
        expect(returnedUser).toMatchObject(dummyUser);
      });

      it("throws error when given an invalid system user ID", async () => {
        expect.assertions(1);
        await expect(getUserBySystemId(randomUUID())).rejects.toThrow();
      }); 
    });

    describe("updateUser()", () => {
      it("returns a user with the updated data", async () => {
        const createdUser = await prisma.user.create({ data: newUser() });
        const updateData: UserUpdateInput = {
          system_name: createdUser.system_name + "_UPDATED",
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
        const createdUser = await prisma.user.create({ data: newUser() });
        const deletedUser = await deleteUser(createdUser.user_id);
        expect.assertions(3);
        expect(isUser(deletedUser)).toBe(true);
        expect(deletedUser).toMatchObject(createdUser);
        const returnedUser = await prisma.user.findUnique({
          where: { user_id: createdUser.user_id },
        });
        expect(returnedUser).toBeNull();
      });
    });
  });

  describe("ROUTERS", () => {
    describe("GET /api/users", () => {
      it("returns status 200", async () => {
        const res = await request.get("/api/users");
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns an array", async () => {
        const res = await request.get("/api/users");
        expect.assertions(1);
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
        const res = await request.post("/api/users/create").send(newUser());
        expect.assertions(1);
        expect(res.status).toBe(201);
      });

      it("returns a user", async () => {
        const res = await request.post("/api/users/create").send(newUser());
        const user = res.body;
        expect.assertions(1);
        expect(isUser(user)).toBe(true);
      });

      it("updates an existing user if the system_user_id already present", async () => {
        const user = await prisma.user.create({ data: newUser() });
        const res = await request
          .post("/api/users/create")
          .send({ ...newUser(), system_user_id: user.system_user_id });
        const user2 = res.body;
        expect.assertions(5);
        expect(user.system_user_id).toStrictEqual(user2.system_user_id);
        expect(user.user_id).toStrictEqual(user2.user_id);
        expect(user.system_name === user2.system_name).toBeFalsy(); //name was updated
        expect(user.create_timestamp.toISOString()).toStrictEqual(
          user2.create_timestamp
        );
        expect(
          user.update_timestamp.toISOString() === user2.update_timestamp
        ).toBeFalsy(); //timestamp updated
      });

      it("strips invalid fields from data", async () => {
        const res = await request
          .post("/api/users/create")
          .send({ ...newUser(), invalidField: "qwerty123" });
        expect.assertions(2);
        expect(res.status).toBe(201);
        expect(res.body).not.toHaveProperty("invalidField");
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
        const res = await request.get(`/api/users/${dummyUser.user_id}`);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns a user", async () => {
        const res = await request.get(`/api/users/${dummyUser.user_id}`);
        expect.assertions(1);
        expect(isUser(res.body)).toBe(true);
      });
    });

    describe("PATCH /api/users/:id", () => {
      it("returns status 404 when id does not exist", async () => {
        const res = await request
          .patch(`/api/users/${randomUUID()}`)
          .send({ system_name: `${randomInt(99999999)}` });
        expect.assertions(1);
        expect(res.status).toBe(404);
      });

      it("returns status 400 when no data provided", async () => {
        const user = await prisma.user.create({ data: newUser() });
        const res = await request.patch(`/api/users/${user.user_id}`);
        expect.assertions(1);
        expect(res.status).toBe(400);
      });

      it("returns status 200", async () => {
        const user = await prisma.user.create({ data: newUser() });
        const res = await request
          .patch(`/api/users/${user.user_id}`)
          .send({ system_name: `${randomInt(99999999)}` });
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns a user", async () => {
        const user = await prisma.user.create({ data: newUser() });
        const res = await request
          .patch(`/api/users/${user.user_id}`)
          .send({ system_name: `${randomInt(99999999)}` });
        expect.assertions(1);
        expect(isUser(res.body)).toBe(true);
      });

      it("returns status 400 when system_user_id already taken", async () => {
        const user = await prisma.user.create({ data: newUser() });
        const res = await request
          .patch(`/api/users/${user.user_id}`)
          .send({ system_user_id: dummyUser.system_user_id });
        expect.assertions(1);
        expect(res.status).toBe(400);
      });

      it("returns status 400 when data contains invalid fields", async () => {
        const user = await prisma.user.create({ data: newUser() });
        const res = await request
          .patch(`/api/users/${user.user_id}`)
          .send({ invalidField: "qwerty123" });
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
        const user = await prisma.user.create({ data: newUser() });
        const res = await request.delete(`/api/users/${user.user_id}`);
        expect.assertions(1);
        expect(res.status).toBe(200);
      });

      it("returns user deleted message", async () => {
        const user = await prisma.user.create({ data: newUser() });
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
