import {
  coordinate_uncertainty_unit,
  critter,
  frequency_unit,
  location,
  sex,
} from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../utils/types";
import { implement, zodID } from "../utils/zod_helpers";

/**
 * @table critter
 *
 * Base Critter schema omitting audit columns.
 * Using 'implement' to keep zod schema in sync with prisma type.
 *
 */
export const CritterSchema = implement<ICritter>().with({
  critter_id: zodID,
  itis_tsn: z.number(),
  itis_scientific_name: z.string(),
  wlh_id: z.string().nullable(),
  animal_id: z.string().nullable(),
  sex: z.nativeEnum(sex),
  responsible_region_nr_id: zodID.nullable(),
  critter_comment: z.string().nullable(),
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

/**
 * Similar critter query schema used in /critters/unique
 *
 */
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

/**
 * TODO: Move these schemas / types to the correct files once additional
 * schema files are created for each service/repo/router
 *
 */
export const DetailedCritterLocationSchema = implement<
  Omit<location, AuditColumns | "region_nr_id" | "region_env_id" | "wmu_id">
>().with({
  location_id: zodID,
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  coordinate_uncertainty: z.number().nullable(),
  coordinate_uncertainty_unit: z
    .nativeEnum(coordinate_uncertainty_unit)
    .nullable(),
  elevation: z.number().nullable(),
  temperature: z.number().nullable(),
  location_comment: z.string().nullable(),
});

export const DetailedCritterMarkingSchema = z.object({
  marking_id: zodID,
  capture_id: zodID.nullable(),
  mortality_id: zodID.nullable(),
  body_location: z.string(),
  material: z.string(),
  primary_colour: z.string().nullable(),
  secondary_colour: z.string().nullable(),
  text_colour: z.string().nullable(),
  identifier: z.string().nullable(),
  frequency: z.number().nullable(),
  frequency_unit: z.nativeEnum(frequency_unit).nullable(),
  order: z.number().nullable(),
  attached_timestamp: z.coerce.date(),
  removed_timestamp: z.coerce.date().nullable(),
  comment: z.string().nullable(),
});

export const DetailedCritterCaptureSchema = z.object({
  capture_id: zodID,
  capture_timestamp: z.coerce.date(),
  release_timestamp: z.coerce.date().nullable(),
  capture_location: DetailedCritterLocationSchema,
  release_location: DetailedCritterLocationSchema,
  capture_comment: z.string().nullable(),
  release_comment: z.string().nullable(),
});

export const DetailedCritterMortalitySchema = z.object({
  mortality_id: zodID,
  mortality_timestamp: z.coerce.date(),
  mortality_location: DetailedCritterLocationSchema,
  proximate_cause_of_death_category: z.string().nullable(),
  proximate_cause_of_death_reason: z.string().nullable(),
  proximate_cause_of_death_confidence: z.string().nullable(),
  ultimate_cause_of_death_category: z.string().nullable(),
  ultimate_cause_of_death_reason: z.string().nullable(),
  mortality_comment: z.string().nullable(),
  proximate_predated_by_itis_tsn: z.number().nullable(),
  ultimate_predated_by_itis_tsn: z.number().nullable(),
});

export const DetailedCritterQualitativeMeasurementSchema = z.object({
  measurement_qualitative_id: zodID,
  taxon_measurement_id: zodID,
  capture_id: zodID.nullable(),
  mortality_id: zodID.nullable(),
  measurement_name: z.string(),
  value: z.string(),
  measurement_comment: z.string(),
  measured_timestamp: z.coerce.date(),
});

export const DetailedCritterQuantitativeMeasurementSchema =
  DetailedCritterQualitativeMeasurementSchema.omit({
    measurement_qualitative_id: true,
    value: true,
  }).extend({ measurement_quantitative_id: zodID, value: z.number() });

export const DetailedCritterCollectionUnit = z.object({
  critter_collection_unit_id: zodID,
  unit_name: z.string(),
  category_name: z.string(),
});

export type IDetailedCritterLocation = z.infer<
  typeof DetailedCritterLocationSchema
>;

export type IDetailedCritterMarking = z.infer<
  typeof DetailedCritterMarkingSchema
>;

export type IDetailedCritterCapture = z.infer<
  typeof DetailedCritterCaptureSchema
>;

export type IDetailedCritterMortality = z.infer<
  typeof DetailedCritterMortalitySchema
>;

export type IDetailedCritterQualitativeMeasurement = z.infer<
  typeof DetailedCritterQualitativeMeasurementSchema
>;

export type IDetailedCritterQuantitativeMeasurement = z.infer<
  typeof DetailedCritterQuantitativeMeasurementSchema
>;

export type IDetailedCritterCollectionUnit = z.infer<
  typeof DetailedCritterCollectionUnit
>;
