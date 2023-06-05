import { system, user } from "@prisma/client";
import { apiError } from "../../utils/types";
import supertest from "supertest";
import { makeApp } from "../../app";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import { UserCreateInput, UserSchema } from "./user.utils";
import {
  createUser as _createUser,
  upsertUser as _upsertUser,
  getUsers as _getUsers,
  getUser as _getUser,
  getUserBySystemId as _getUserBySystemId,
  updateUser as _updateUser,
  deleteUser as _deleteUser,
  setUserContext as _setUserContext,
} from "./user.service";
import { zodID } from "../../utils/zod_helpers";
import { assert } from "console";

// Mock User Objects
const ID = "11084b96-5cbd-421e-8106-511ecfb51f7a";

const NEW_USER: UserCreateInput = {
  system_user_id: "MOCK_USER",
  system_name: system.CRITTERBASE,
  keycloak_uuid: ID,
};

const RETURN_USER: user = {
  ...NEW_USER,
  keycloak_uuid: ID,
  user_id: ID,
  create_user: ID,
  update_user: ID,
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

// Mocked Prisma Calls
const create = jest.spyOn(prisma.user, "create").mockImplementation();
const upsert = jest.spyOn(prisma.user, "upsert").mockImplementation();
const findMany = jest.spyOn(prisma.user, "findMany").mockImplementation();
const findUniqueOrThrow = jest
  .spyOn(prisma.user, "findUniqueOrThrow")
  .mockImplementation();
const update = jest.spyOn(prisma.user, "update").mockImplementation();
const pDelete = jest.spyOn(prisma.user, "delete").mockImplementation();
const queryRaw = jest.spyOn(prisma, "$queryRaw").mockImplementation();

// Mocked Services
const createUser = jest.fn();
const upsertUser = jest.fn();
const getUsers = jest.fn();
const getUser = jest.fn();
const getUserBySystemId = jest.fn();
const updateUser = jest.fn();
const deleteUser = jest.fn();
const setUserContext = jest.fn();

const request = supertest(
  makeApp({
    createUser,
    upsertUser,
    getUsers,
    getUser,
    getUserBySystemId,
    updateUser,
    deleteUser,
    setUserContext,
  } as Record<keyof ICbDatabase, any>)
);

beforeEach(() => {
  //TODO: Reset mocked prisma calls?

  // Reset mocked services
  createUser.mockReset();
  upsertUser.mockReset();
  getUsers.mockReset();
  getUser.mockReset();
  getUserBySystemId.mockReset();
  updateUser.mockReset();
  deleteUser.mockReset();
  setUserContext.mockReset();

  // Set default returns
  getUsers.mockResolvedValue([RETURN_USER]);
  createUser.mockResolvedValue(RETURN_USER);
});

describe("API: User", () => {
  describe("SERVICES", () => {
    describe("createUser()", () => {
      it("returns a user", async () => {
        create.mockResolvedValue(RETURN_USER);
        const returnedUser = await _createUser(NEW_USER);
        expect.assertions(2);
        expect(prisma.user.create).toHaveBeenCalledTimes(1);
        expect(UserSchema.safeParse(returnedUser).success).toBe(true);
      });
    });
    describe("upsertUser()", () => {
      it("returns a user", async () => {
        upsert.mockResolvedValue(RETURN_USER);
        const returnedUser = await _upsertUser(NEW_USER);
        expect.assertions(2);
        expect(prisma.user.upsert).toHaveBeenCalledTimes(1);
        expect(UserSchema.safeParse(returnedUser).success).toBe(true);
      });
    });
    describe("getUsers()", () => {
      it("returns an array of users with correct properties", async () => {
        findMany.mockResolvedValue([RETURN_USER]);
        const users = await _getUsers();
        expect.assertions(3);
        expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBe(1);
      });
    });

    describe("getUser()", () => {
      it("returns a user when given a valid user ID", async () => {
        findUniqueOrThrow.mockResolvedValue(RETURN_USER);
        const returnedUser = await _getUser(ID);
        expect.assertions(2);
        expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
        expect(UserSchema.safeParse(returnedUser).success).toBe(true);
      });

      it("throws error when given an invalid user ID", async () => {
        findUniqueOrThrow.mockRejectedValue(new Error());
        await expect(_getUser(ID)).rejects.toThrow();
      });
    });

    describe("updateUser()", () => {
      it("returns a user with the updated data", async () => {
        update.mockResolvedValue(RETURN_USER);
        const returnedUser = await _updateUser(ID, NEW_USER);
        expect.assertions(2);
        expect(prisma.user.update).toHaveBeenCalledTimes(1);
        expect(UserSchema.safeParse(returnedUser).success).toBe(true);
      });
    });

    describe("deleteUser()", () => {
      it("returns deleted user and removes user from database", async () => {
        pDelete.mockResolvedValue(RETURN_USER);
        const deletedUser = await _deleteUser(ID);
        expect.assertions(3);
        expect(prisma.user.delete).toHaveBeenCalledTimes(1);
        expect(prisma.user.delete).toHaveBeenCalledWith({
          where: { user_id: ID },
        });
        expect(UserSchema.safeParse(deletedUser).success).toBe(true);
      });
    });

    describe("setUserContext()", () => {
      it("sets the user context with provided user_id and system_name", async () => {
        queryRaw.mockResolvedValue([{ api_set_context: ID }]);
        const result = await _setUserContext(ID, system.CRITTERBASE);
        expect.assertions(3);
        expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
        expect(result).toBeDefined();
        expect(zodID.safeParse(result).success).toBe(true);
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
        expect.assertions(1);
        for (const user of users) {
          expect(UserSchema.safeParse(user).success).toBe(true);
        }
      });
    });

    describe("POST /api/users/create", () => {
      it("returns status 201", async () => {
        const res = await request.post("/api/users/create").send(NEW_USER);
        expect.assertions(1);
        expect(res.status).toBe(201);
      });

      it("returns a user", async () => {
        const res = await request.post("/api/users/create").send(NEW_USER);
        const user = res.body;
        expect(UserSchema.safeParse(user).success);
      });

      // TODO:
    //   it("updates an existing user if the system_user_id already present", async () => {
    //     const user = await prisma.user.create({ data: newUser() });
    //     const res = await request.post("/api/users/create").send({
    //       ...newUser(),
    //       system_user_id: user.system_user_id,
    //       system_name: user.system_name,
    //     });
    //     const user2 = res.body;
    //     expect.assertions(4);
    //     expect(user.system_user_id).toStrictEqual(user2.system_user_id);
    //     expect(user.user_id).toStrictEqual(user2.user_id);
    //     expect(user.create_timestamp.toISOString()).toStrictEqual(
    //       user2.create_timestamp
    //     );
    //     expect(
    //       user.update_timestamp.toISOString() === user2.update_timestamp
    //     ).toBeFalsy(); //timestamp updated
    //   });

    //   it("strips invalid fields from data", async () => {
    //     const res = await request
    //       .post("/api/users/create")
    //       .send({ ...newUser(), invalidField: "qwerty123" });
    //     expect.assertions(2);
    //     expect(res.status).toBe(201);
    //     expect(res.body).not.toHaveProperty("invalidField");
    //   });

    //   it("returns status 400 when data is missing required fields", async () => {
    //     const user = newUser();
    //     const res = await request.post("/api/users/create").send({
    //       keycloak_uuid: user.keycloak_uuid,
    //     });
    //     expect.assertions(1);
    //     expect(res.status).toBe(400);
    //   });
    });
  });
});
