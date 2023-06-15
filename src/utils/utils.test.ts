import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
// import { app } from "../server";
import {
  formatParse,
  getFormat,
  intersect,
  prismaErrorMsg,
  sessionHours,
  toSelect,
} from "./helper_functions";
import { catchErrors, errorHandler, errorLogger } from "./middleware";
import { apiError, QueryFormats } from "./types";
import { FormatParse } from "./types";
import { ResponseSchema } from "./zod_helpers";

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
        expect(arrData.length).toBe(1);
      });
    });
  });
  describe("File: middleware.ts", () => {
    // let mockError = {} as apiError;
    // let mockRequest = {} as Request;
    // let mockNext: NextFunction = jest.fn();
    // const mockResponse = {
    //   json: jest.fn(),
    //   status: jest.fn(() => mockResponse),
    // } as unknown as Response;
    // let server: any;
    // beforeAll((done) => {
    //   server = app.listen(4000, () => {
    //     done();
    //   });
    //   jest.spyOn(console, "error").mockImplementation(() => {});
    //   jest.spyOn(console, "log").mockImplementation(() => {});
    // });
    // afterAll((done) => {
    //   server && server.close(done);
    // });
    // // describe(home.name, () => {
    // //   it("sets a json.res", async () => {
    // //     home(mockRequest, mockResponse);
    // //     expect(mockResponse.json);
    // //   });
    // // });
    // describe(errorLogger.name, () => {
    //   it("next() called once", async () => {
    //     errorLogger(mockError, mockRequest, mockResponse, mockNext);
    //     expect(mockNext).toBeCalledTimes(1);
    //   });
    //   it("console.error not called when NODE_ENV == test", async () => {
    //     errorLogger(mockError, mockRequest, mockResponse, mockNext);
    //     expect(console.error).toBeCalledTimes(0);
    //   });
    //   // it("console.error called once when NODE_ENV != test", async () => {
    //   //   //process.env.NODE_ENV = "development";
    //   //   console.log("test");
    //   //   errorLogger(mockError, mockRequest, mockResponse, mockNext);
    //   //   //expect(console.error).toBeCalledTimes(1);
    //   //   //process.env.NODE_ENV = "test";
    //   // });
    // });
    // describe(errorHandler.name, () => {
    //   it("apiError with message returns status 400 and json", () => {
    //     errorHandler(new apiError("test"), mockRequest, mockResponse, mockNext);
    //     expect(mockResponse.json).toBeCalledWith({
    //       error: "test",
    //     });
    //     expect(mockResponse.status).toBeCalledWith(400);
    //   });
    //   it("apiError without message returns status 400 and default message", () => {
    //     errorHandler(new apiError(), mockRequest, mockResponse, mockNext);
    //     expect(mockResponse.json).toBeCalledWith({
    //       error: "Unknown error occurred",
    //     });
    //     expect(mockResponse.status).toBeCalledWith(400);
    //   });
    //   it("apiError returns error status and json", () => {
    //     errorHandler(
    //       new apiError("apiError", 555),
    //       mockRequest,
    //       mockResponse,
    //       mockNext
    //     );
    //     expect(mockResponse.json);
    //     expect(mockResponse.status).toBeCalledWith(555);
    //   });
    //   it("when apiError with no status, returns 400 and json", () => {
    //     errorHandler(
    //       new apiError("apiError"),
    //       mockRequest,
    //       mockResponse,
    //       mockNext
    //     );
    //     expect(mockResponse.json);
    //     expect(mockResponse.status).toBeCalledWith(400);
    //   });
    //   it("when apiError.toString() formats correctly", () => {
    //     const e = new apiError("Testing apiError", 999);
    //     expect(e.toString()).toEqual("error: Testing apiError");
    //   });
    // });
    // describe(catchErrors.name, () => {
    //   it("placeholder for test", () => {
    //     const fn = jest.fn();
    //     catchErrors(fn);
    //     expect(true);
    //   });
    // });
  });
});
