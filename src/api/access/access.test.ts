import { system, user } from "@prisma/client";
import { apiError } from "../../utils/types";
// import { createUser } from "../user/user.service";
import { PrismaClient as OriginalPrismaClient } from "@prisma/client";
import supertest from "supertest";
import { makeApp } from "../../app";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import {
  loginUser as _loginUser,
  getTableDataTypes as _getTableDataTypes,
} from "./access.service";
import { LoginCredentials } from "../user/user.utils";
const ID = "11084b96-5cbd-421e-8106-511ecfb51f7a";
const USER: user = {
  user_id: ID,
  system_user_id: "1",
  system_name: "CRITTERBASE",
  keycloak_uuid: ID,
  create_user: ID,
  update_user: ID,
  create_timestamp: new Date(),
  update_timestamp: new Date(),
};

const findUnique = jest.spyOn(prisma.user, "findUnique").mockImplementation();
const findFirst = jest.spyOn(prisma.user, "findFirst").mockImplementation();
const queryRaw = jest.spyOn(prisma, "$queryRaw").mockImplementation();

const loginUser = jest.fn();
const createUser = jest.fn();
const setUserContext = jest.fn();
const getTableDataTypes = jest.fn();

const request = supertest(
  makeApp({
    loginUser,
    createUser,
    setUserContext,
    getTableDataTypes,
  } as Record<keyof ICbDatabase, any>)
);

beforeEach(() => {
  loginUser.mockReset();
  createUser.mockReset();
  setUserContext.mockReset();
  getTableDataTypes.mockReset();
  loginUser.mockResolvedValue({ user_id: ID });
  createUser.mockResolvedValue({
    system_user_id: ID,
    system_name: "CRITTERBASE",
  });
  getTableDataTypes.mockResolvedValue(true);
  //prisma functions
  findUnique.mockResolvedValue(USER);
  findFirst.mockResolvedValue(USER);
  queryRaw.mockResolvedValue({ data: "lol" });
});

describe("SERVICES", () => {
  describe("loginUser", () => {
    it("user_id: login succeeds with valid user_id", async () => {
      const user = await _loginUser({ user_id: ID, keycloak_uuid: ID });
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(user?.user_id).toBeDefined();
    });
    it("user_id: login fails with non existant user_id", async () => {
      findFirst.mockResolvedValue(null);
      await expect(_loginUser({ user_id: 'd3984687-0e85-4126-94e5-22a0eb0b5569', keycloak_uuid: 'd39846870e85412694e522a0eb0b5569'})).rejects.toThrowError(apiError);
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
    });
    it("keycloak_uuid: login fails with invalid formatted keycloak_uuid", async () => {
      findFirst.mockResolvedValue(null);
      await expect(_loginUser({ user_id: 'd3984687-0e85-4126-94e5-22a0eb0b5569', keycloak_uuid: "test" })).rejects.toThrowError(
      apiError
    );
    expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
    });
  })
  describe("getTableDataTypes", () => {
    it("should call prisma raw query", () => {
      const types = _getTableDataTypes("user");
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(types).toBeDefined();
    });
  });
  describe("ROUTERS", () => {
    describe("/api/", () => {
      it("should return 200 and welcome message", async () => {
        const res = await request.get("/api/");
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
    });
    //describe("/api/login", () => {
    //it("should return status 200 with valid body", async () => {
    //const res = await request.post("/api/login").send({ user_id: ID });
    //expect(loginUser.mock.calls.length).toBe(1);
    //expect(loginUser.mock.calls[0][0].user_id).toBe(ID);
    //expect(res.status).toBe(200);
    //});
    //it("should return status 400 with no body", async () => {
    //const res = await request.post("/api/login").send({});
    //expect(res.status).toBe(400);
    //expect(loginUser.mock.calls.length).toBe(0);
    //});
    //});
    describe("/api/signup", () => {
      it("should return status 200 with valid body", async () => {
        const res = await request
          .post("/api/signup")
          .send({ system_name: system.BCTW, system_user_id: 1 });
        expect(createUser.mock.calls.length).toBe(1);
        expect(setUserContext.mock.calls.length).toBe(1);
        expect(setUserContext.mock.calls[0][0]).toBe(ID);
        expect(setUserContext.mock.calls[0][1]).toBe("CRITTERBASE");
        expect(res.status).toBe(201);
      });
    });
    describe("/api/types/:model", () => {
      it("should return status 200 with valid body", async () => {
        const res = await request.get("/api/types/user");
        expect(getTableDataTypes.mock.calls.length).toBe(1);
        expect(getTableDataTypes.mock.calls[0][0]).toBe("user");
        expect(res.status).toBe(200);
      });
    });
  });
});
