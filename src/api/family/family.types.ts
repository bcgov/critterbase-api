import { critter } from "@prisma/client"
import { z } from "zod"

type ImmediateFamily = {
    children: critter[],
    parents: critter[]
}
  
type ImmediateFamilyCritter = {
    children: critter[],
    siblings: critter[]
    parents: critter[]
}

const FamilyUpdateBodySchema = z.object({
    family_label: z.string()
});

const FamilyCreateBodySchema = z.object({
    family_id: z.string().uuid().optional(),
    family_label: z.string()
});

const FamilyParentCreateBodySchema = z.object({
    family_id: z.string().uuid(),
    parent_critter_id: z.string().uuid()
})

const FamilyChildCreateBodySchema = z.object({
    family_id: z.string().uuid(),
    child_critter_id: z.string().uuid()
})

type FamilyUpdate = z.infer<typeof FamilyUpdateBodySchema>
type FamilyCreate = z.infer<typeof FamilyCreateBodySchema>
type FamilyParentCreate = z.infer<typeof FamilyParentCreateBodySchema>
type FamilyChildCreate = z.infer<typeof FamilyChildCreateBodySchema>

export {FamilyUpdateBodySchema, FamilyCreateBodySchema, FamilyParentCreateBodySchema, FamilyChildCreateBodySchema}
export type {ImmediateFamily, ImmediateFamilyCritter, FamilyUpdate, FamilyCreate, FamilyChildCreate, FamilyParentCreate}