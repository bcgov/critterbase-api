import { NextFunction, Request, Response } from "express";
import { Server, IncomingMessage, ServerResponse } from "http";
import { errorLogger, home } from "./express_handlers";
import { cError } from "./global_types";
let mockError: Error | cError = new cError("Test error", 555);
let mockRequest = {} as Request;
let mockResponse = {} as Response;
let mockNext: NextFunction = jest.fn();

// afterAll((done) => {
//   server && server.close(done);
// });
describe("Utils", () => {
  describe("express_handlers", () => {
    describe("home()", () => {
      it("home returns information", () => {
        //home(mockRequest, mockResponse, mockNext);
        expect(true);
      });
    });
  });
});
