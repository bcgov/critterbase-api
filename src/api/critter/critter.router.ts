import express from "express";
import type { Request, Response } from "express";
import { catchErrors } from "../../utils/express_handlers";
import { getCritter } from "./critter.service";

export const critterRouter = express.Router();

critterRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    return res.status(200).json("Welcome to the Critter Router.");
  })
);

critterRouter.get(
  "/:id",
  catchErrors(async (req: Request, res: Response) => {
    const id = req.params.id;
    const critter = getCritter();
    return res.status(200).json({ critter });
  })
);
