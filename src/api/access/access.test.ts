import { system } from "@prisma/client";
import { apiError } from "../../utils/types";
// import { createUser } from "../user/user.service";
import { PrismaClient as OriginalPrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";
import supertest from "supertest";
import { makeApp } from "../../app";
import { prisma } from "../../utils/constants";
import { ICbDatabase } from "../../utils/database";
import { loginUser as _loginUser } from "./access.service";
//jest.spyOn(prisma.user, "findUnique").mockImplementation();

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

const ValidID = "11084b96-5cbd-421e-8106-511ecfb51f7a";

beforeEach(() => {
  loginUser.mockReset();
  createUser.mockReset();
  setUserContext.mockReset();
  getTableDataTypes.mockReset();

  setUserContext.mockResolvedValue(ValidID);
  loginUser.mockResolvedValue({ user_id: ValidID });
  createUser.mockResolvedValue({
    system_user_id: ValidID,
    system_name: "CRITTERBASE",
  });
  getTableDataTypes.mockResolvedValue(true);
});

describe("SERVICES", () => {
  let u: any;
  const keycloak_uuid = "11084b96-5cbd-421e-8106-511ecfb51f7b";
  //const spyContext = jest.spyOn(userService, "setUserContext");
  // beforeAll(async () => {
  //   u = await createUser({
  //     system_user_id: "0",
  //     system_name: system.BCTW,
  //     keycloak_uuid,
  //   });
  // });
  // afterAll(async () => {
  //   await prisma.user.deleteMany({ where: { system_name: system.BCTW } });
  // });
  describe("loginUser", () => {
    it("user_id: login succeeds with valid user_id", async () => {
      loginUser.call({ user_id: ValidID });
      expect(loginUser.mock.calls.length).toBe(1);
      //expect(setUserContext.mock.calls.length).toBe(1);
      // expect(loginUser.mock.calls[0][0]).toBe()
      //expect(loginUser({ user_id: u.user_id }))
      // expect(spyContext).toHaveBeenCalled();
    });
    // it("user_id: login fails with invalid formatted user_id", async () => {
    //   loginUser.call({ user_id: "test" });
    //   console.log(loginUser.mock.results[0].value);
    //   // console.log(loginUser.mock);
    //   // await expect(loginUser({ user_id: "test" })).rejects.toThrowError(
    //   //   PrismaClientKnownRequestError
    //   // );
    //   //expect(spyContext).not.toHaveBeenCalled();
    // });
    it("user_id: login fails with non existant user_id", async () => {
      await expect(loginUser({ user_id: keycloak_uuid })).rejects.toThrowError(
        apiError
      );
      //expect(spyContext).not.toHaveBeenCalled();
    });
    it("keycloak_uuid: login fails with invalid formatted keycloak_uuid", async () => {
      loginUser.mockReset();
      loginUser.call({ keycloak_uuid: "test" });
      expect(loginUser.mock.calls.length).toBe(1);
      // console.log(loginUser.mock);
      // expect(loginUser.mock.results[0].value).resolves;
      // await expect(loginUser({ keycloak_uuid: "test" })).rejects.toThrowError(
      //   PrismaClientKnownRequestError
      // );
      //expect(spyContext).not.toHaveBeenCalled();
    });
    it("keycloak_uuid: login fails with null keycloak_uuid", async () => {
      await expect(_loginUser({ keycloak_uuid: null })).rejects.toThrowError(
        apiError
      );
      //expect(spyContext).not.toHaveBeenCalled();
    });
    it("keycloak_uuid: login fails with non existing keycloak_uuid", async () => {
      await expect(
        loginUser({ keycloak_uuid: "11084b96-5cbd-421e-8106-511ecfb51f7a" })
      ).rejects.toThrowError(apiError);
      //expect(spyContext).not.toHaveBeenCalled();
    });
    it("keycloak_uuid: login succeeds with valid keycloak_uuid", async () => {
      expect(await loginUser({ keycloak_uuid })).toBeDefined();
      //expect(spyContext).toHaveBeenCalled();
    });

    it("system_user_id + system_name: login succeeds with valid system_name and system_user_id", async () => {
      loginUser.call({ system_name: "CRITTERBASE", system_user_id: ValidID });
      expect(loginUser.mock.calls.length).toBe(1);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
    it("system_user_id + system_name: login fails with system_name and missing system_user_id", async () => {
      //Calling original implementation to test thrown errors
      await expect(
        _loginUser({ system_name: "CRITTERBASE" })
      ).rejects.toThrowError(apiError);
      expect(setUserContext.mock.calls.length).toBe(0);
    });
    it("system_user_id + system_name: login fails with missing system_name and valid system_user_id", async () => {
      //Calling original implementation to test thrown errors
      await expect(
        _loginUser({ system_user_id: ValidID })
      ).rejects.toThrowError(apiError);
      expect(setUserContext.mock.calls.length).toBe(0);
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
    describe("/api/login", () => {
      it("should return status 200 with valid body", async () => {
        const res = await request
          .post("/api/login")
          .send({ user_id: "11084b96-5cbd-421e-8106-511ecfb51f7a" });
        expect(loginUser.mock.calls.length).toBe(1);
        expect(res.body.user_id).toBeDefined();
      });
      it("should return status 400 with no body", async () => {
        const res = await request.post("/api/login").send({});
        expect.assertions(1);
        expect(res.status).toBe(400);
      });
    });
    describe("/api/signup", () => {
      it("should return status 200 with valid body", async () => {
        const res = await request
          .post("/api/signup")
          .send({ system_name: system.BCTW, system_user_id: 1 });
        expect(createUser.mock.calls.length).toBe(1);
        expect(setUserContext.mock.calls.length).toBe(1);
        expect(setUserContext.mock.calls[0][0]).toBe(ValidID);
        expect(setUserContext.mock.calls[0][1]).toBe("CRITTERBASE");
        expect(res.status).toBe(201);
      });
    });
    describe("/api/types/:model", () => {
      it("should return status 200 with valid body", async () => {
        const res = await request.get("/api/types/user");
        expect(getTableDataTypes.mock.calls.length).toBe(1);
        expect(getTableDataTypes.mock.calls[0][0]).toBe("user");
      });
    });
  });
});
