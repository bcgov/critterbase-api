import { critter, family, family_child, family_parent, Prisma } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import { implement, zodAudit, zodID } from "../../utils/zod_helpers";

interface ImmediateFamily {
  children: critter[];
  parents: critter[];
}

interface ImmediateFamilyCritter {
  children: critter[];
  siblings: critter[];
  parents: critter[];
}

const FamilySchema = implement<family>().with({
  family_id: zodID,
  family_label: z.string(),
  ...zodAudit
})

const FamilyChildSchema = implement<family_child>().with({
  ...FamilySchema.omit({ family_label: true }).shape,
  child_critter_id: zodID,
})

const FamilyParentSchema = implement<family_parent>().with({
  ...FamilySchema.omit({ family_label: true }).shape,
  parent_critter_id: zodID,
})

const FamilyCreateBodySchema = implement<
  Omit<Prisma.familyCreateManyInput, "family_id" | keyof AuditColumns>
>().with({
  family_label: z.string(),
});

const FamilyParentCreateBodySchema = implement<
  Omit<Prisma.family_parentCreateManyInput, keyof AuditColumns>
>().with({
  family_id: zodID,
  parent_critter_id: zodID,
});

const FamilyChildCreateBodySchema = implement<
  Omit<Prisma.family_childCreateManyInput, keyof AuditColumns>
>().with({
  family_id: zodID,
  child_critter_id: zodID,
});

type FamilyUpdate = z.infer<typeof FamilyCreateBodySchema>;
type FamilyCreate = z.infer<typeof FamilyCreateBodySchema>;
type FamilyParentCreate = z.infer<typeof FamilyParentCreateBodySchema>;
type FamilyChildCreate = z.infer<typeof FamilyChildCreateBodySchema>;

export {
  FamilyChildSchema,
  FamilyCreateBodySchema,
  FamilyParentCreateBodySchema,
  FamilyChildCreateBodySchema,
  FamilySchema,
  FamilyParentSchema
};
export type {
  ImmediateFamily,
  ImmediateFamilyCritter,
  FamilyUpdate,
  FamilyCreate,
  FamilyChildCreate,
  FamilyParentCreate,
};
