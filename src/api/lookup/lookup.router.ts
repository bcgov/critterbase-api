/* eslint-disable @typescript-eslint/require-await */
import express from "express";
import { Request, Response } from "express-serve-static-core";
import { catchErrors } from "../../utils/middleware";
import { locationRouter } from "../location/location.router";
import { sex } from ".prisma/client";

export const lookupRouter = express.Router();

/**
 ** Get all locations
 */
lookupRouter.get(
  "/sex",
  catchErrors(async (req: Request, res: Response) => res.status(200).json(sex))
);
