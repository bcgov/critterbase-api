import type { Request, Response } from "express";
import express, { NextFunction } from "express";
import { prisma } from "../../utils/constants";
import { catchErrors } from "../../utils/middleware";
import { uuidParamsSchema } from "../../utils/zod_helpers";
import {
  createNewFamily,
  deleteFamily,
  getAllChildren,
  getAllFamilies,
  getAllParents,
  getChildrenOfCritterId,
  getFamilyById,
  getFamilyByLabel,
  getImmediateFamily,
  getImmediateFamilyOfCritter,
  getParentsOfCritterId,
  makeChildOfFamily,
  makeParentOfFamily,
  removeChildOfFamily,
  removeParentOfFamily,
  updateFamily,
} from "./family.service";
import {
  FamilyChildCreateBodySchema,
  FamilyCreateBodySchema,
  FamilyParentCreateBodySchema,
} from "./family.utils";

export const familyRouter = express.Router();

/**
 ** Family Router Home
 */
familyRouter.get(
  "/",
  catchErrors(async (req: Request, res: Response) => {
    const families = await getAllFamilies();
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
    const result = await createNewFamily(parsed.family_label);
    return res.status(201).json(result);
  })
);

familyRouter.get(
  "/children",
  catchErrors(async (req: Request, res: Response) => {
    const children = await getAllChildren();
    return res.status(200).json(children);
  })
);

familyRouter.get(
  "/parents",
  catchErrors(async (req: Request, res: Response) => {
    const parents = await getAllParents();
    return res.status(200).json(parents);
  })
);

familyRouter.get(
  "/parents/:id",
  catchErrors(async (req: Request, res: Response) => {
    const { id } = uuidParamsSchema.parse(req.params);
    const parents = await getParentsOfCritterId(id);
    return res.status(200).json(parents);
  })
);

familyRouter.get(
  "/children/:id",
  catchErrors(async (req: Request, res: Response) => {
    const { id } = uuidParamsSchema.parse(req.params);
    const parents = await getChildrenOfCritterId(id);
    return res.status(200).json(parents);
  })
);

familyRouter
  .route("/parents")
  .post(
    catchErrors(async (req: Request, res: Response) => {
      const parsed = FamilyParentCreateBodySchema.parse(req.body);
      const parent_id = parsed.parent_critter_id;
      const family_id = parsed.family_id;
      const result = await makeParentOfFamily(family_id, parent_id);
      return res.status(201).json(result);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const parsed = FamilyParentCreateBodySchema.parse(req.body);
      const parent_id = parsed.parent_critter_id;
      const family_id = parsed.family_id;
      const result = await removeParentOfFamily(family_id, parent_id);
      return res.status(200).json(result);
    })
  );

familyRouter
  .route("/children")
  .post(
    catchErrors(async (req: Request, res: Response) => {
      const parsed = FamilyChildCreateBodySchema.parse(req.body);
      const child_id = parsed.child_critter_id;
      const family_id = parsed.family_id;
      const result = await makeChildOfFamily(family_id, child_id);
      return res.status(201).json(result);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const parsed = FamilyChildCreateBodySchema.parse(req.body);
      const child_id = parsed.child_critter_id;
      const family_id = parsed.family_id;
      const result = await removeChildOfFamily(family_id, child_id);
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
    const result = await getImmediateFamilyOfCritter(id);
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
      const family = await getImmediateFamily(id);
      return res.status(200).json(family);
    })
  )
  .put(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const parsed = FamilyCreateBodySchema.parse(req.body);
      const family = await updateFamily(id, parsed);
      return res.status(200).json(family);
    })
  )
  .delete(
    catchErrors(async (req: Request, res: Response) => {
      const id = req.params.id;
      const family = await deleteFamily(id);
      return res.status(200).json(family);
    })
  );

familyRouter.get(
  "/label/:label",
  catchErrors(async (req: Request, res: Response) => {
    const label = req.params.label;
    const result = await getFamilyByLabel(label);
    res.status(200).json(result);
  })
);
