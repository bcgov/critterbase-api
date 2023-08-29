import type { Request, Response } from "express";
import express, { NextFunction } from "express";
import { prisma } from "../../utils/constants";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  FamilyChildCreateBodySchema,
  FamilyCreateBodySchema,
  FamilyParentCreateBodySchema,
  FamilyUpdateBodySchema,
} from "./family.utils";
import { ICbDatabase } from "../../utils/database";

export const FamilyRouter = (db: ICbDatabase) => {
  const familyRouter = express.Router();

  /**
   ** Family Router Home
   */
  familyRouter.get(
    "/",
    catchErrors(async (req: Request, res: Response) => {
      const families = await db.getAllFamilies();
      return res.status(200).json(families);
    })
  );

  /**
   ** Create new family
   */
  familyRouter.post(
    "/create",
    catchErrors(async (req: Request, res: Response) => {
      const parsed = FamilyCreateBodySchema.parse(req.body);
      const result = await db.createNewFamily(parsed.family_label);
      return res.status(201).json(result);
    })
  );

  familyRouter.get(
    "/parents/:id",
    catchErrors(async (req: Request, res: Response) => {
      const { id } = uuidParamsSchema.parse(req.params);
      const parents = await db.getParentsOfCritterId(id);
      return res.status(200).json(parents);
    })
  );

  familyRouter
    .route("/parents")
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const parents = await db.getAllParents();
        return res.status(200).json(parents);
      })
    )
    .post(
      catchErrors(async (req: Request, res: Response) => {
        const parsed = FamilyParentCreateBodySchema.parse(req.body);
        const parent_id = parsed.parent_critter_id;
        const family_id = parsed.family_id;
        const result = await db.makeParentOfFamily(family_id, parent_id);
        return res.status(201).json(result);
      })
    )
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const parsed = FamilyParentCreateBodySchema.parse(req.body);
        const parent_id = parsed.parent_critter_id;
        const family_id = parsed.family_id;
        const result = await db.removeParentOfFamily(family_id, parent_id);
        return res.status(200).json(result);
      })
    );

  familyRouter.get(
    "/children/:id",
    catchErrors(async (req: Request, res: Response) => {
      const { id } = uuidParamsSchema.parse(req.params);
      const children = await db.getChildrenOfCritterId(id);
      return res.status(200).json(children);
    })
  );

  familyRouter
    .route("/children")
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const children = await db.getAllChildren();
        return res.status(200).json(children);
      })
    )
    .post(
      catchErrors(async (req: Request, res: Response) => {
        const parsed = FamilyChildCreateBodySchema.parse(req.body);
        const child_id = parsed.child_critter_id;
        const family_id = parsed.family_id;
        const result = await db.makeChildOfFamily(family_id, child_id);
        return res.status(201).json(result);
      })
    )
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const parsed = FamilyChildCreateBodySchema.parse(req.body);
        const child_id = parsed.child_critter_id;
        const family_id = parsed.family_id;
        const result = await db.removeChildOfFamily(family_id, child_id);
        return res.status(200).json(result);
      })
    );

  /**
   * * All critter_id related routes
   */
  familyRouter.get(
    "/immediate/:id",
    catchErrors(async (req: Request, res: Response) => {
      const { id } = uuidParamsSchema.parse(req.params);
      const parents = await db.getParentsOfCritterId(id);
      const children = await db.getChildrenOfCritterId(id);
      const siblings = await db.getSiblingsOfCritterId(id);
      const result = {
        children: children,
        siblings: siblings,
        parents: parents,
      };
      return res.status(200).json(result);
    })
  );

  familyRouter
    .route("/:id")
    .all(
      catchErrors(async (req: Request, res: Response, next: NextFunction) => {
        uuidParamsSchema.parse(req.params);
        await prisma.family.findUniqueOrThrow({
          where: {
            family_id: req.params.id,
          },
        });
        next();
      })
    )
    .get(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const family = await db.getImmediateFamily(id);
        return res.status(200).json(family);
      })
    )
    .patch(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const parsed = FamilyUpdateBodySchema.parse(req.body);
        const family = await db.updateFamily(id, parsed);
        return res.status(200).json(family);
      })
    )
    .delete(
      catchErrors(async (req: Request, res: Response) => {
        const id = req.params.id;
        const family = await db.deleteFamily(id);
        return res.status(200).json(family);
      })
    );

  familyRouter.get(
    "/label/:label",
    catchErrors(async (req: Request, res: Response) => {
      const label = req.params.label;
      const result = await db.getFamilyByLabel(label);
      res.status(200).json(result);
    })
  );

  return familyRouter;
};
