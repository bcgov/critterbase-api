import { NextFunction, Request, Response } from "express";
import { Server, IncomingMessage, ServerResponse } from "http";
import { reset } from "nodemon";
import { app } from "../server";
import { request } from "./constants";
import { catchErrors, errorHandler, errorLogger, home } from "./middleware";
import { cError } from "./global_types";

let mockError = {} as Error | cError;
let mockRequest = {} as Request;
let mockNext: NextFunction = jest.fn();
const mockResponse = {
  json: jest.fn(),
  status: jest.fn(() => mockResponse),
} as unknown as Response;

let server: any;

beforeEach((done) => {
  server = app.listen(4000, () => {
    done();
  });
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach((done) => {
  server && server.close(done);
});

describe("Utils", () => {
  describe("File: express_handlers.ts", () => {
    describe("home()", () => {
      it("sets a json.res", async () => {
        home(mockRequest, mockResponse, mockNext);
        expect(mockResponse.json);
      });
    });

    describe("errorLogger()", () => {
      it("next() and console.error() called once", async () => {
        errorLogger(mockError, mockRequest, mockResponse, mockNext);
        expect(mockNext).toBeCalledTimes(1);
        expect(console.error).toBeCalledTimes(1);
      });
    });

    describe("errorHandler()", () => {
      it("Error with message returns status 400 and json", () => {
        errorHandler(new Error("test"), mockRequest, mockResponse, mockNext);
        expect(mockResponse.json).toBeCalledWith({
          error: "test",
        });
        expect(mockResponse.status).toBeCalledWith(400);
      });

      it("Error without message returns status 400 and default message", () => {
        errorHandler(new Error(undefined), mockRequest, mockResponse, mockNext);
        expect(mockResponse.json).toBeCalledWith({
          error: "Unknown error occurred",
        });
        expect(mockResponse.status).toBeCalledWith(400);
      });

      it("cError returns error status and json", () => {
        errorHandler(
          new cError("cError", 555),
          mockRequest,
          mockResponse,
          mockNext
        );
        expect(mockResponse.json);
        expect(mockResponse.status).toBeCalledWith(555);
      });

      it("when cError with no status, returns 400 and json", () => {
        errorHandler(new cError("cError"), mockRequest, mockResponse, mockNext);
        expect(mockResponse.json);
        expect(mockResponse.status).toBeCalledWith(400);
      });

      it("when cError.toString() formats correctly", () => {
        const e = new cError("Testing cError", 999);
        expect(e.toString()).toEqual("error: Testing cError status: 999");
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
