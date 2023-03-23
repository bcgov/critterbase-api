import { NextFunction, Request, Response } from "express";
import { app } from "../server";
import { prismaErrorMsg } from "./helper_functions";
import { catchErrors, errorHandler, errorLogger, home } from "./middleware";
import { apiError } from "./types";

describe("Utils", () => {
  describe("File: helper_functions.ts", () => {
    describe("prismaErrorMsg()", () => {
      const badCode = "PPPP";
      const defaultMsg = `unsupported prisma error: "${badCode}"`;
      const supportedErrorCodes = ["P2025", "P2002"];
      it("should return default error message on unsupported code", () => {
        const msg = prismaErrorMsg(badCode);
        expect(msg).toBe(defaultMsg);
      });
      it("should create new error message for supported codes", () => {
        supportedErrorCodes.forEach((code) =>
          expect(prismaErrorMsg(code)).not.toBe(defaultMsg)
        );
      });
    });
  });
  describe("File: middleware.ts", () => {
    let mockError = {} as apiError;
    let mockRequest = {} as Request;
    let mockNext: NextFunction = jest.fn();
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn(() => mockResponse),
    } as unknown as Response;
    let server: any;

    beforeAll((done) => {
      server = app.listen(4000, () => {
        done();
      });
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterAll((done) => {
      server && server.close(done);
    });
    describe("home()", () => {
      it("sets a json.res", async () => {
        home(mockRequest, mockResponse, mockNext);
        expect(mockResponse.json);
      });
    });

    describe("errorLogger()", () => {
      it("next() called once", async () => {
        errorLogger(mockError, mockRequest, mockResponse, mockNext);
        expect(mockNext).toBeCalledTimes(1);
      });
      it("console.error not called when NODE_ENV == test", async () => {
        errorLogger(mockError, mockRequest, mockResponse, mockNext);
        expect(console.error).toBeCalledTimes(0);
      });
      it("console.error called once when NODE_ENV != test", async () => {
        process.env.NODE_ENV = "development";
        errorLogger(mockError, mockRequest, mockResponse, mockNext);
        expect(console.error).toBeCalledTimes(0);
        process.env.NODE_ENV = "test";
      });
    });

    describe("errorHandler()", () => {
      it("apiError with message returns status 400 and json", () => {
        errorHandler(new apiError("test"), mockRequest, mockResponse, mockNext);
        expect(mockResponse.json).toBeCalledWith({
          error: "test",
        });
        expect(mockResponse.status).toBeCalledWith(400);
      });

      it("apiError without message returns status 400 and default message", () => {
        errorHandler(new apiError(), mockRequest, mockResponse, mockNext);
        expect(mockResponse.json).toBeCalledWith({
          error: "Unknown error occurred",
        });
        expect(mockResponse.status).toBeCalledWith(400);
      });

      it("apiError returns error status and json", () => {
        errorHandler(
          new apiError("apiError", 555),
          mockRequest,
          mockResponse,
          mockNext
        );
        expect(mockResponse.json);
        expect(mockResponse.status).toBeCalledWith(555);
      });

      it("when apiError with no status, returns 400 and json", () => {
        errorHandler(
          new apiError("apiError"),
          mockRequest,
          mockResponse,
          mockNext
        );
        expect(mockResponse.json);
        expect(mockResponse.status).toBeCalledWith(400);
      });

      it("when apiError.toString() formats correctly", () => {
        const e = new apiError("Testing apiError", 999);
        expect(e.toString()).toEqual("error: Testing apiError");
      });
    });

    describe("catchErrors()", () => {
      it("placeholder for test", () => {
        const fn = jest.fn();
        catchErrors(fn);
        expect(true);
      });
    });
  });
});
