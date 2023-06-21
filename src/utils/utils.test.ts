import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request } from "express";
// import { app } from "../server";
import {
  formatParse,
  getFormat,
  getParentTaxonIds,
  intersect,
  prismaErrorMsg,
  prisMock,
  sessionHours,
  toSelect,
} from "./helper_functions";
// import { catchErrors, errorHandler, errorLogger } from "./middleware";
import { ZodError, ZodIssueCode } from "zod";
import { prisma } from "./constants";
import * as mw from "./middleware";
import { apiError, FormatParse, QueryFormats } from "./types";
import { NumberToString, ResponseSchema } from "./zod_helpers";
const ID = "e47da43e-bb5b-46e9-8403-f0eff31e5522";
const KEYCLOAK_ID = "ababababababababababababababababab";
describe("Utils", () => {
  describe("File: helper_functions.ts", () => {
    describe(sessionHours.name, () => {
      it("should equal num hours * 3600000", () => {
        expect(sessionHours(1)).toBe(3600000);
      });
    });
    describe(intersect.name, () => {
      const aArr = [1, 2, 3];
      const bArr = [1];
      it("should fully merge both obj arrays", () => {
        expect(intersect([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3]);
      });
      it("should only merge matching elements", () => {
        expect(intersect([1], [1, 2, 3])).toEqual([1]);
      });
      it("should return empty if no matches", () => {
        expect(intersect([1, 2, 3], [4])).toEqual([]);
      });
    });
    describe(toSelect.name, () => {
      type IObj = { identifier: 1; name: string };
      const obj: IObj = {
        identifier: 1,
        name: "Mr.Obj",
      };
      it("should return key, id and value", () => {
        const select = toSelect<IObj>(obj, "identifier", "name");
        expect(select).toHaveProperty("id");
        ["id", "key", "value"].forEach((k) => {
          expect(select).toHaveProperty(k);
        });
      });
    });
    describe(getFormat.name, () => {
      const req: Partial<Request> = {
        query: {
          format: undefined,
        },
      };
      it("should return correct format from request", () => {
        Object.values(QueryFormats).forEach((q) => {
          req!.query!.format = q;
          expect(getFormat(req as Request)).toBe(q);
        });
        req!.query!.format = "badFormat";
        expect(getFormat(req as Request)).toBe(QueryFormats.default);
      });
    });
    describe(prismaErrorMsg.name, () => {
      const defaultMsg = `unsupported prisma error: "BADCODE"`;
      const supportedErrorCodes = ["P2025", "P2002", "P2003"];
      let ops: any = {
        code: undefined,
        clientVersion: "1",
        meta: {
          fieldName: 1,
          cause: 1,
          target: 2,
        },
      };
      it("should return default error message on unsupported code", () => {
        ops.code = "BADCODE";
        const { error, status } = prismaErrorMsg(
          new PrismaClientKnownRequestError("1", { ...ops, code: "BADCODE" })
        );
        expect(error).toBe(defaultMsg);
        expect(status).toBe(400);
      });
      it("should create new error message for supported codes", () => {
        ops.code = supportedErrorCodes[2];
        const { error: err1, status: status1 } = prismaErrorMsg(
          new PrismaClientKnownRequestError("test 1", { ...ops })
        );
        ops.meta.fieldName = "ERROR";
        const { error: err2, status: status2 } = prismaErrorMsg(
          new PrismaClientKnownRequestError("test 1", { ...ops })
        );
        expect(err1).not.toEqual(err2);
        expect(status1).toBe(404);
        expect(status2).toBe(404);
        ops.code = supportedErrorCodes[1];
        const { error: err3, status: status3 } = prismaErrorMsg(
          new PrismaClientKnownRequestError("test 1", { ...ops })
        );
        ops.meta.target = "ERROR";
        const { error: err4, status: status4 } = prismaErrorMsg(
          new PrismaClientKnownRequestError("test 1", { ...ops })
        );
        expect(err3).not.toEqual(err4);
        expect(status3).toBe(400);
        expect(status4).toBe(400);
        ops.code = supportedErrorCodes[0];
        const { error: err5, status: status5 } = prismaErrorMsg(
          new PrismaClientKnownRequestError("test 1", { ...ops })
        );
        ops.meta.cause = "ERROR";
        const { error: err6, status: status6 } = prismaErrorMsg(
          new PrismaClientKnownRequestError("test 1", { ...ops })
        );
        expect(err5).not.toEqual(err6);
        expect(status5).toBe(404);
        expect(status6).toBe(404);
      });
    });
    describe(formatParse.name, () => {
      const parser: FormatParse = {
        detailed: {
          schema: ResponseSchema.transform((v) => ({ b: v.a })),
        },
      };
      const a = { a: 1 };
      const service = async () => {
        return a;
      };
      it("should return original data with no parser provided", async () => {
        const data = await formatParse(QueryFormats.default, service(), parser);
        expect(data).toEqual(a);
      });
      it("should return data formatted as detailed schema", async () => {
        const data = await formatParse(
          QueryFormats.detailed,
          service(),
          parser
        );
        expect(data).toEqual({ b: 1 });
      });
      it("handles both arrays and objects", async () => {
        const data = await formatParse(
          QueryFormats.detailed,
          service(),
          parser
        );
        expect(data).toEqual({ b: 1 });
        expect(data.length).not.toBeDefined();
        const arrService = async () => {
          return [{ a: 1 }];
        };
        const arrData = await formatParse(
          QueryFormats.detailed,
          arrService(),
          parser
        );
        expect(arrData.length);
      });
    });
    describe(getParentTaxonIds.name, () => {
      const p = jest
        .spyOn(prisma, "$queryRaw")
        .mockImplementation()
        .mockResolvedValue([{ get_taxon_ids: ["UUID"] }]);
      it("should return an array of taxon Ids", async () => {
        const ids = await getParentTaxonIds("TEST");
        expect(ids.length).toBe(1);
        expect(ids[0]).toBe("UUID");
      });
      it("returns empty array if no parent taxon_ids found", async () => {
        p.mockResolvedValue({});
        const ids = await getParentTaxonIds("TEST");
        expect(ids.length).toBe(0);
      });
    });
    describe(prisMock.name, () => {
      it("should return a primsa spyOn mock instance", () => {
        const p = prisMock("user", "findMany", { value: true });
        expect(p.mock).toBeDefined();
      });
    });
  });
  describe("File: middleware.ts", () => {
    let mockReq = { method: "GET", originalUrl: "url" } as Request;
    let mockNext = jest.fn();
    const mockRes = {
      json: jest.fn(),
      status: jest.fn(() => mockRes),
    };
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    describe("errorLogger", () => {
      it("should not log when node_env is TEST", async () => {
        const middleware = require("./middleware");
        middleware.errorLogger(new Error("Error"), mockReq, mockRes, mockNext);
        expect(mockNext.mock.calls.length).toBe(1);
      });
      it("should log when node_env is not TEST", async () => {
        process.env.NODE_ENV = "development";
        jest.resetModules();
        const middleware = require("./middleware");
        middleware.errorLogger(new Error("Error"), mockReq, mockRes, mockNext);
        expect(consoleError.mock.calls.length).toBe(1);
        middleware.errorLogger("TEST", mockReq, mockRes, mockNext);
        expect(consoleError.mock.calls[0][0]).toBeDefined();
        process.env.NODE_ENV = "test";
      });
    });
    describe("catchErrors", () => {
      const mockHandler = jest.fn().mockResolvedValue("tmp");
      it("should call mockHandler", async () => {
        const test = mw.catchErrors(mockHandler);
        test(mockReq, mockRes, mockNext);
        expect(mockHandler.mock.calls.length).toBe(1);
      });
    });

    describe("auth", () => {
      it("should call next if IS_TEST or NO_AUTH", () => {
        mw.auth(mockReq, mockRes, mockNext);
        expect(mockNext.mock.calls.length).toBe(1);
      });
      it("should parse headers if not test and auth enabled", () => {
        process.env.NODE_ENV = "development";
        mockReq.headers = {
          "user-id": ID,
          "keycloak-uuid": ID,
          "api-key": ID,
        };
        jest.resetModules();
        jest.mock("../api/access/access.service", () => ({
          loginUser: async () => {
            console.log("mock loginUser called");
          },
        }));
        const middleware = require("./middleware");
        middleware.auth(mockReq, mockRes, mockNext);
        process.env.NODE_ENV = "test";
      });
    });
    describe("errorHandler", () => {
      const middleware = require("./middleware");
      it("should catch Errors", () => {
        middleware.errorHandler(new Error("Error"), mockReq, mockRes, mockNext);
        expect(mockRes.status.mock.calls[0][0]).toBe(400);
        expect(mockRes.json.mock.calls[0][0]).toEqual({ error: "Error" });
      });

      it("should catch Errors with safeguard for no message", () => {
        middleware.errorHandler(new Error(), mockReq, mockRes, mockNext);
        expect(mockRes.status.mock.calls[0][0]).toBe(400);
        expect(mockRes.json.mock.calls[0][0]).toEqual({
          error: "unknown error",
        });
      });
      it("should catch apiError", () => {
        middleware.errorHandler(
          new apiError("apiError"),
          mockReq,
          mockRes,
          mockNext
        );
        expect(mockRes.status.mock.calls[0][0]).toBe(400);
        expect(mockRes.json.mock.calls[0][0]).toEqual({ error: "apiError" });
      });

      it("should catch PrismaKnownClinentError", () => {
        middleware.errorHandler(
          new PrismaClientKnownRequestError("Prisma", {
            code: "Prisma",
          } as any),
          mockReq,
          mockRes,
          mockNext
        );
        expect(mockRes.status.mock.calls[0][0]).toBe(400);
        expect(mockRes.json.mock.calls[0][0]).toEqual({
          error: `unsupported prisma error: "Prisma"`,
        });
      });

      it("should catch custom ZodError", () => {
        middleware.errorHandler(
          new ZodError([
            {
              code: ZodIssueCode.unrecognized_keys,
              keys: ["KeyA"],
              path: ["PathA"],
              message: "ZodErr~Issue",
            },
          ]),
          mockReq,
          mockRes,
          mockNext
        );
        expect(mockRes.status.mock.calls[0][0]).toBe(400);
        expect(mockRes.json.mock.calls[0][0]).toBeDefined();
        expect(mockRes.json.mock.calls[0][0].errors.ZodErr).toBeDefined();
      });

      it("should catch custom ZodError", () => {
        middleware.errorHandler(
          new ZodError([
            {
              code: ZodIssueCode.unrecognized_keys,
              keys: ["KeyA"],
              path: ["PathA"],
              message: "",
            },
          ]),
          mockReq,
          mockRes,
          mockNext
        );
        expect(mockRes.status.mock.calls[0][0]).toBe(400);
        expect(mockRes.json.mock.calls[0][0]).toBeDefined();
        expect(mockRes.json.mock.calls[0][0].errors.ZodErr).not.toBeDefined();
      });
      it("should catch fieldKey ZodError", () => {
        middleware.errorHandler(
          new ZodError([
            {
              code: ZodIssueCode.invalid_date,
              path: [],
              message: "Issue",
            },
          ]),
          mockReq,
          mockRes,
          mockNext
        );
        expect(mockRes.status.mock.calls[0][0]).toBe(400);
        expect(mockRes.json.mock.calls[0][0]).toBeDefined();
        expect(mockRes.json.mock.calls[0][0]).toEqual({ error: "Issue" });
      });
      it("should pass to next if no errors are passed", () => {
        middleware.errorHandler(undefined, mockReq, mockRes, mockNext);
        expect(mockNext.mock.calls.length).toBe(1);
      });
    });
  });
  describe("zod_helpers.ts", () => {
    describe("NumberToString", () => {
      it("should parse to string if number / string provided", () => {
        expect(NumberToString.parse(1)).toBe("1");
        expect(NumberToString.parse("1")).toBe("1");
      });
    });
  });
});
