import { critter, family, family_child, family_parent, Prisma } from '@prisma/client';
import { z } from 'zod';
import { AuditColumns } from '../../utils/types';
import { DeleteSchema, implement, zodAudit, zodID } from '../../utils/zod_helpers';

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
});

const FamilyChildSchema = implement<family_child>().with({
  ...FamilySchema.omit({ family_label: true }).shape,
  child_critter_id: zodID
});

const FamilyParentSchema = implement<family_parent>().with({
  ...FamilySchema.omit({ family_label: true }).shape,
  parent_critter_id: zodID
});

const FamilyCreateBodySchema = implement<Omit<Prisma.familyCreateManyInput, AuditColumns>>().with({
  family_id: zodID,
  family_label: z.string()
});

const FamilyUpdateBodySchema = FamilyCreateBodySchema.omit({ family_id: true });

const FamilyParentCreateBodySchema = implement<Omit<Prisma.family_parentCreateManyInput, AuditColumns>>().with({
  family_id: zodID,
  parent_critter_id: zodID
});

const FamilyChildCreateBodySchema = implement<Omit<Prisma.family_childCreateManyInput, AuditColumns>>().with({
  family_id: zodID,
  child_critter_id: zodID
});

const FamilyParentDeleteSchema = FamilyParentSchema.pick({
  family_id: true,
  parent_critter_id: true
}).extend(DeleteSchema.shape);
const FamilyChildDeleteSchema = FamilyChildSchema.pick({
  family_id: true,
  child_critter_id: true
}).extend(DeleteSchema.shape);

type FamilyUpdate = z.infer<typeof FamilyUpdateBodySchema>;
type FamilyCreate = z.infer<typeof FamilyCreateBodySchema>;
type FamilyParentCreate = z.infer<typeof FamilyParentCreateBodySchema>;
type FamilyChildCreate = z.infer<typeof FamilyChildCreateBodySchema>;

export {
  FamilyChildSchema,
  FamilyCreateBodySchema,
  FamilyUpdateBodySchema,
  FamilyParentCreateBodySchema,
  FamilyChildCreateBodySchema,
  FamilySchema,
  FamilyParentSchema,
  FamilyParentDeleteSchema,
  FamilyChildDeleteSchema
};
export type {
  ImmediateFamily,
  ImmediateFamilyCritter,
  FamilyUpdate,
  FamilyCreate,
  FamilyChildCreate,
  FamilyParentCreate
};
