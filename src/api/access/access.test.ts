import { system } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma, request } from "../../utils/constants";
import { apiError } from "../../utils/types";
import { createUser } from "../user/user.service";
import { loginUser } from "./access.service";
import * as userService from "../user/user.service";
describe("SERVICES", () => {
  let u: any;
  const keycloak_uuid = "11084b96-5cbd-421e-8106-511ecfb51f7b";
  const spyContext = jest.spyOn(userService, "setUserContext");
  beforeAll(async () => {
    u = await createUser({
      system_user_id: "0",
      system_name: system.BCTW,
      keycloak_uuid,
    });
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { system_name: system.BCTW } });
  });
  describe(loginUser.name, () => {
    it("user_id: login succeeds with valid user_id", async () => {
      expect(await loginUser({ user_id: u.user_id })).toBeDefined();
      expect(spyContext).toHaveBeenCalled();
    });
    it("user_id: login fails with invalid formatted user_id", async () => {
      await expect(loginUser({ user_id: "test" })).rejects.toThrowError(
        PrismaClientKnownRequestError
      );
      expect(spyContext).not.toHaveBeenCalled();
    });
    it("user_id: login fails with non existant user_id", async () => {
      await expect(loginUser({ user_id: keycloak_uuid })).rejects.toThrowError(
        apiError
      );
      expect(spyContext).not.toHaveBeenCalled();
    });
    it("keycloak_uuid: login fails with invalid formatted keycloak_uuid", async () => {
      await expect(loginUser({ keycloak_uuid: "test" })).rejects.toThrowError(
        PrismaClientKnownRequestError
      );
      expect(spyContext).not.toHaveBeenCalled();
    });
    it("keycloak_uuid: login fails with null keycloak_uuid", async () => {
      await expect(loginUser({ keycloak_uuid: null })).rejects.toThrowError(
        apiError
      );
      expect(spyContext).not.toHaveBeenCalled();
    });
    it("keycloak_uuid: login fails with non existing keycloak_uuid", async () => {
      await expect(
        loginUser({ keycloak_uuid: "11084b96-5cbd-421e-8106-511ecfb51f7a" })
      ).rejects.toThrowError(apiError);
      expect(spyContext).not.toHaveBeenCalled();
    });
    it("keycloak_uuid: login succeeds with valid keycloak_uuid", async () => {
      expect(await loginUser({ keycloak_uuid })).toBeDefined();
      expect(spyContext).toHaveBeenCalled();
    });

    it("system_user_id + system_name: login succeeds with valid system_name and system_user_id", async () => {
      expect(
        await loginUser({
          system_name: u.system_name,
          system_user_id: u.system_user_id,
        })
      ).toBeDefined();
      expect(spyContext).toHaveBeenCalled();
    });
    it("system_user_id + system_name: login fails with system_name and missing system_user_id", async () => {
      await expect(
        loginUser({ system_name: u.system_name })
      ).rejects.toThrowError(apiError);
      expect(spyContext).not.toHaveBeenCalled();
    });
    it("system_user_id + system_name: login fails with missing system_name and valid system_user_id", async () => {
      await expect(
        loginUser({ system_user_id: u.system_user_id })
      ).rejects.toThrowError(apiError);
      expect(spyContext).not.toHaveBeenCalled();
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
          .send({ user_id: u.user_id });
        expect.assertions(1);
        expect(res.status).toBe(200);
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
        console.log(res.body);
        expect.assertions(1);
        expect(res.status).toBe(201);
      });
      // it("should return status 400 with no body", async () => {
      //   const res = await request.post("/api/login").send({});
      //   expect.assertions(1);
      //   expect(res.status).toBe(400);
      // });
    });
  });
});
