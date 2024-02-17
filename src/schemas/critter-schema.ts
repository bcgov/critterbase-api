import { critter, sex } from "@prisma/client";
import { z } from "zod";
import { extendZodWithOpenApi } from "zod-openapi";
import { AuditColumns } from "../utils/types";
import { implement, zodID } from "../utils/zod_helpers";

extendZodWithOpenApi(z);

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
  .openapi({
    example: {
      critter_id: "43201d4d-f16f-4f8e-8413-dde5d4a195e6",
      wlh_id: "17-1053",
      animal_id: "Caribou-99",
      sex: "Female",
      itis_tsn: 180701,
      itis_scientific_name: "Alces alces",
      responsible_region_nr_id: "22734fe6-09af-47e9-936b-7dc9f1b40449",
      critter_comment: "open api example critter",
    },
  });

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

export const SimilarCritterQuerySchema = z.object({
  critter: CritterSchema.partial().optional(),
  marking: z
    .object({
      primary_colour: z.string(),
      identifier: z.string(),
      marking_type: z.string(),
      body_location: z.string(),
    })
    .partial()
    .optional(),
});

/**
 * Inferred types from zod schemas.
 */
export type ICritter = Omit<critter, AuditColumns>; // Omitting audit columns.

export type CritterUpdate = z.infer<typeof CritterUpdateSchema>;

export type CritterCreateOptionalItis = z.infer<typeof CritterCreateSchema>;

export type SimilarCritterQuery = z.infer<typeof SimilarCritterQuerySchema>;

export type CritterCreateRequiredItis = z.infer<typeof CritterCreateSchema> &
  Pick<ICritter, "itis_scientific_name" | "itis_tsn">;

export enum eCritterStatus {
  alive = "alive",
  mortality = "mortality",
}
