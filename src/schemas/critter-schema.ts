import { critter, sex } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../utils/types";
import { implement, zodID } from "../utils/zod_helpers";

/**
 * Critter schema and types
 *
 *
 * Base Critter schema omitting audit columns.
 * Using 'implement' to keep zod schema in sync with prisma type.
 */
export const CritterSchema = implement<ICritter>()
  .with({
    critter_id: zodID,
    itis_tsn: z.number(),
    itis_scientific_name: z.string(),
    wlh_id: z.string().nullable(),
    animal_id: z.string().nullable(),
    sex: z.nativeEnum(sex),
    responsible_region_nr_id: zodID.nullable(),
    critter_comment: z.string().nullable(),
  })
  .strict();

/**
 * Create critter schema used in post requests
 * should only include itis_tsn or itis_scientific_name to prevent
 * tsn and scientific name from becoming out of sync
 */
export const CritterCreateSchema = CritterSchema.omit({ critter_id: true })
  .partial()
  .required({ sex: true })
  .refine(
    (schema) =>
      (schema.itis_tsn && !schema.itis_scientific_name) ||
      (!schema.itis_tsn && schema.itis_scientific_name),
    "must include itis_tsn or itis_scientific_name but not both",
  );

/**
 * Update critter schema used in update / patch requests
 */
export const CritterUpdateSchema = CritterSchema.omit({
  critter_id: true,
}).partial();

/**
 * Inferred types from zod schemas.
 */
export type ICritter = Omit<critter, AuditColumns>; // Omitting audit columns.

export type CritterUpdate = z.infer<typeof CritterUpdateSchema>;

export type CritterCreateOptionalItis = z.infer<typeof CritterCreateSchema>;
export type CritterCreateRequiredItis = z.infer<typeof CritterCreateSchema> &
  Pick<ICritter, "itis_scientific_name" | "itis_tsn">;

export enum eCritterStatus {
  alive = "alive",
  mortality = "mortality",
}
