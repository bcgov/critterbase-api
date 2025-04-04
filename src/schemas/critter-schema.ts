import { critter, frequency_unit } from '@prisma/client';
import { z } from 'zod';
import { AuditColumns } from '../utils/types';
import { zodID } from '../utils/zod_helpers';
import { DetailedCaptureSchema } from './capture-schema';
import { LocationSchema } from './location-schema';

export enum eCritterStatus {
  alive = 'alive',
  mortality = 'mortality'
}

/**
 * @table critter
 *
 * Base Critter schema omitting audit columns.
 *
 */
const CritterSchemaBase = z.object({
  critter_id: z.string().uuid(),
  itis_tsn: z.number(),
  itis_scientific_name: z.string(),
  wlh_id: z.string().nullable(),
  animal_id: z.string().nullable(),
  responsible_region_nr_id: z.string().uuid().nullable(),
  critter_comment: z.string().nullable(),
  sex_qualitative_option_id: z.string().uuid().nullable()
});

/**
 * @table critter
 *
 * Base Critter schema omitting audit columns. Also omits sex_qualitative_option_id because an object called 'sex' is
 * returned to include the option_label (eg. male, female, etc.).
 *
 */
export const GetCritterSchema = CritterSchemaBase.omit({ sex_qualitative_option_id: true }).extend({
  sex: z
    .object({
      qualitative_option_id: z.string().uuid(),
      label: z.string()
    })
    .nullable()
});

/**
 * Create critter schema used in post requests.
 * Must include at least one of itis_tsn or itis_scientific_name.
 */
export const CreateCritterSchema = CritterSchemaBase.partial().refine(
  (schema) => schema.itis_tsn || schema.itis_scientific_name,
  'must include at least one of itis_tsn or itis_scientific_name'
);

export const BulkCritterCreateSchema = CritterSchemaBase.partial().required({
  critter_id: true,
  itis_tsn: true,
  itis_scientific_name: true
});

/**
 * Update critter schema used in update / patch requests
 */
export const UpdateCritterSchema = CritterSchemaBase.omit({
  critter_id: true,
  itis_scientific_name: true
}).partial();

export const BulkUpdateCritterSchema = CritterSchemaBase.partial().omit({
  itis_scientific_name: true
});

/**
 * Similar critter query schema used in /critters/unique
 *
 */
export const SimilarCritterQuerySchema = z.object({
  critter: GetCritterSchema.partial().optional(),
  markings: z
    .array(
      z
        .object({
          primary_colour: z.string(),
          identifier: z.string(),
          marking_type: z.string(),
          body_location: z.string()
        })
        .partial()
    )
    .optional()
});

/**
 * Critter ids request schema. Used in post requests which accept array of critter_ids.
 *
 */
export const CritterIdsRequestSchema = z.object({
  critter_ids: z.array(zodID)
});

export const WlhIdQuerySchema = z.object({ wlh_id: z.string().optional() }); //Add additional properties as needed

/**
 * Inferred types from zod schemas.
 */
export type ICritterForView = z.infer<typeof GetCritterSchema>;

export type ICritter = Omit<critter, AuditColumns>; // Omitting audit columns.

export type CritterUpdate = z.infer<typeof UpdateCritterSchema>;

export type BulkUpdateCritterSchema = z.infer<typeof BulkUpdateCritterSchema>;

export type BulkCritterCreateSchema = z.infer<typeof BulkCritterCreateSchema>;

export type CritterCreateOptionalItis = z.infer<typeof CreateCritterSchema>;

export type SimilarCritterQuery = z.infer<typeof SimilarCritterQuerySchema>;

export type CritterCreateRequiredItis = z.infer<typeof CreateCritterSchema> &
  Pick<ICritter, 'itis_scientific_name' | 'itis_tsn'>;

/**
 * TODO: Move these schemas / types to the correct files once additional
 * schema files are created for each service/repo/router
 *
 */

export const DetailedCritterMarkingSchema = z
  .object({
    marking_id: zodID,
    capture_id: zodID.nullable(),
    mortality_id: zodID.nullable(),
    taxon_marking_body_location_id: zodID,
    body_location: z.string(),
    marking_type: z.string(),
    marking_type_id: zodID,
    material: z.string().nullable(),
    marking_material_id: zodID.nullable(),
    primary_colour: z.string().nullable(),
    primary_colour_id: zodID.nullable(),
    secondary_colour: z.string().nullable(),
    secondary_colour_id: zodID.nullable(),
    text_colour: z.string().nullable(),
    text_colour_id: zodID.nullable(),
    identifier: z.string().nullable(),
    frequency: z.number().nullable(),
    frequency_unit: z.nativeEnum(frequency_unit).nullable(),
    order: z.number().nullable(),
    attached_timestamp: z.coerce.date(),
    removed_timestamp: z.coerce.date().nullable(),
    comment: z.string().nullable()
  })
  .strict();

export const DetailedCritterMortalitySchema = z
  .object({
    mortality_id: zodID,
    mortality_timestamp: z.coerce.date(),
    location: LocationSchema.nullable(),
    proximate_cause_of_death_id: zodID.nullable(),
    proximate_cause_of_death_confidence: z.string().nullable(),
    ultimate_cause_of_death_id: zodID.nullable(),
    ultimate_cause_of_death_confidence: z.string().nullable(),
    mortality_comment: z.string().nullable(),
    proximate_predated_by_itis_tsn: z.number().nullable(),
    ultimate_predated_by_itis_tsn: z.number().nullable()
  })
  .strict();

export const DetailedCritterQualitativeMeasurementSchema = z.object({
  measurement_qualitative_id: zodID,
  taxon_measurement_id: zodID,
  qualitative_option_id: zodID,
  capture_id: zodID.nullable(),
  mortality_id: zodID.nullable(),
  measurement_name: z.string(),
  value: z.string(),
  measurement_comment: z.string().nullable(),
  measured_timestamp: z.coerce.date()
});

export const DetailedCritterQuantitativeMeasurementSchema = DetailedCritterQualitativeMeasurementSchema.omit({
  measurement_qualitative_id: true,
  qualitative_option_id: true,
  value: true
})
  .extend({ measurement_quantitative_id: zodID, value: z.number() })
  .strict();

export const DetailedCritterCollectionUnit = z.object({
  critter_collection_unit_id: zodID,
  collection_unit_id: zodID,
  collection_category_id: zodID,
  unit_name: z.string(),
  category_name: z.string()
});

export const DetailedCritterParentSchema = z
  .object({
    family_id: zodID,
    family_label: z.string(),
    parent_critter_id: zodID
  })
  .strict();

export const DetailedCritterChildSchema = z
  .object({
    family_id: zodID,
    family_label: z.string(),
    child_critter_id: zodID
  })
  .strict();

export const DetailedCritterSchema = GetCritterSchema.extend({
  markings: DetailedCritterMarkingSchema.array(),
  captures: DetailedCaptureSchema.array(),
  collection_units: DetailedCritterCollectionUnit.array(),
  mortality: DetailedCritterMortalitySchema.array(),
  measurements: z.object({
    qualitative: DetailedCritterQualitativeMeasurementSchema.array(),
    quantitative: DetailedCritterQuantitativeMeasurementSchema.array()
  }),
  family_parent: DetailedCritterParentSchema.array(),
  family_child: DetailedCritterChildSchema.array()
}).strict();

export const DetailedManyCritterSchema = GetCritterSchema.extend({
  mortality: z.object({ mortality_id: zodID, mortality_timestamp: z.coerce.date() }).array(),
  collection_units: DetailedCritterCollectionUnit.array()
});

export type IDetailedCritter = z.infer<typeof DetailedCritterSchema>;

export type IDetailedManyCritter = z.infer<typeof DetailedManyCritterSchema>;

export type IDetailedCritterParent = z.infer<typeof DetailedCritterParentSchema>;

export type IDetailedCritterChild = z.infer<typeof DetailedCritterChildSchema>;

export type IDetailedCritterMarking = z.infer<typeof DetailedCritterMarkingSchema>;

export type IDetailedCritterMortality = z.infer<typeof DetailedCritterMortalitySchema>;

export type IDetailedCritterQualitativeMeasurement = z.infer<typeof DetailedCritterQualitativeMeasurementSchema>;

export type IDetailedCritterQuantitativeMeasurement = z.infer<typeof DetailedCritterQuantitativeMeasurementSchema>;

export type IDetailedCritterCollectionUnit = z.infer<typeof DetailedCritterCollectionUnit>;
