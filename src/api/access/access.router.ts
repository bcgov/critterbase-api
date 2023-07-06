import { Request, Response } from "express";
import { catchErrors } from "../../utils/middleware";
import { UserCreateBodySchema } from "../user/user.utils";

import { Prisma } from "@prisma/client";
import express from "express";
import { ICbDatabase } from "../../utils/database";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - system_user_id
 *         - system_name
 *       properties:
 *         system_user_id:
 *           type: string
 *           description: The id of the user.
 *         system_name:
 *           type: string
 *           description: The name of the user.
 */
export const AccessRouter = (db: ICbDatabase) => {
  const accessRouter = express.Router();

  /**
   ** Logs basic details about the current supported routes
   * @params All four express params.
   */
  /**
   * @openapi
   * /:
   *   get:
   *     description: Logs basic details about the current supported routes
   *     responses:
   *       200:
   *         description: Welcome to Critterbase API
   */
  accessRouter.get("/", (req: Request, res: Response) => {
    return res.status(200).json("Welcome to Critterbase API");
  });

  /**
   ** Signup endpoint
   */
  /**
   * @openapi
   * /signup:
   *   post:
   *     description: Signup endpoint
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         description: Successfully created user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user_id:
   *                   type: string
   */
  accessRouter.post(
    "/signup",
    catchErrors(async (req: Request, res: Response) => {
      const parsedUser = UserCreateBodySchema.parse(req.body);
      const user = await db.createUser(parsedUser);
      const contextUserId = await db.setUserContext(
        user.system_user_id,
        user.system_name
      );
      return res.status(201).json({ user_id: contextUserId }).end();
    })
  );

  /**
   * @openapi
   * /types/{model}:
   *   get:
   *     parameters:
   *       - in: path
   *         name: model
   *         required: true
   *         description: Model name
   *         schema:
   *           type: string
   *     description: Retrieves data types of a given model
   *     responses:
   *       200:
   *         description: Data types of the model
   */
  accessRouter.get(
    "/types/:model",
    catchErrors(async (req: Request, res: Response) => {
      const types = await db.getTableDataTypes(
        req.params.model as Prisma.ModelName
      );
      return res.status(200).json(types);
    })
  );

  return accessRouter;
};
