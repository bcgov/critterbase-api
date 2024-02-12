import { critter, sex } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../utils/types";
import { implement, zodID } from "../utils/zod_helpers";

/**
 *
 * Critter schema and types
 *
 */
// Base critter schema
export const CritterSchema = implement<ICritter>().with({
  critter_id: zodID,
  itis_tsn: z.number(),
  wlh_id: z.string().nullable(),
  animal_id: z.string().nullable(),
  sex: z.nativeEnum(sex),
  responsible_region_nr_id: zodID.nullable(),
  critter_comment: z.string().nullable(),
});

// Update critter schema used in update / patch requests
export const CritterUpdateSchema = CritterSchema.omit({
  critter_id: true,
}).partial();

// Create critter schema used in post requests
export const CritterCreateSchema = CritterSchema.omit({ critter_id: true });

/**
 *
 * Types from zod schemas.
 *
 */
export type ICritter = Omit<critter, AuditColumns>; // Omitting audit columns.
export type CritterUpdate = z.infer<typeof CritterUpdateSchema>;
export type CritterCreate = z.infer<typeof CritterCreateSchema>;

export enum eCritterStatus {
  alive = "alive",
  mortality = "mortality",
}
