import {
  lk_collection_category,
  measurement_unit,
  xref_collection_unit,
  xref_taxon_marking_body_location,
  xref_taxon_measurement_qualitative,
  xref_taxon_measurement_qualitative_option,
  xref_taxon_measurement_quantitative,
} from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../utils/types";
import { implement, zodID } from "../utils/zod_helpers";

/**
 * @table xref_taxon_marking_body_location
 *
 */
export const TsnMarkingBodyLocationSchema = implement<
  Omit<xref_taxon_marking_body_location, AuditColumns>
>().with({
  taxon_marking_body_location_id: zodID,
  itis_tsn: z.number(),
  body_location: z.string(),
  description: z.string().nullable(),
});

/**
 * @table xref_taxon_measurement_qualitative_option
 *
 */
export const TsnQualitativeMeasurementOptionSchema = implement<
  Omit<xref_taxon_measurement_qualitative_option, AuditColumns>
>().with({
  qualitative_option_id: zodID,
  taxon_measurement_id: zodID,
  option_label: z.string().nullable(),
  option_value: z.number(),
  option_desc: z.string().nullable(),
});

/**
 * @table xref_taxon_measurement_qualitative + xref_taxon_measurement_qualitative_option
 *
 */
export const TsnQualitativeMeasurementSchema = implement<
  Omit<xref_taxon_measurement_qualitative, AuditColumns> & {
    options: ITsnQualitativeMeasurementOption[];
  }
>().with({
  taxon_measurement_id: zodID,
  itis_tsn: z.number().nullable(), // TODO: This shouldnt be nullable
  measurement_name: z.string(),
  measurement_desc: z.string().nullable(),
  options: z.array(TsnQualitativeMeasurementOptionSchema),
});

/**
 * @table xref_taxon_measurement_quantitative
 *
 */
export const TsnQuantitativeMeasurementSchema = implement<
  Omit<xref_taxon_measurement_quantitative, AuditColumns>
>().with({
  taxon_measurement_id: zodID,
  itis_tsn: z.number(),
  measurement_name: z.string(),
  measurement_desc: z.string().nullable(),
  min_value: z.number(),
  max_value: z.number().nullable(),
  unit: z.nativeEnum(measurement_unit),
});

export const TsnMeasurementsSchema = z.object({
  qualitative: TsnQualitativeMeasurementSchema.array(),
  quantitative: TsnQuantitativeMeasurementSchema.array(),
});

/**
 * Types from zod schemas.
 *
 */

export type ITsnMarkingBodyLocation = z.infer<
  typeof TsnMarkingBodyLocationSchema
>;

export type ITsnQualitativeMeasurement = z.infer<
  typeof TsnQualitativeMeasurementSchema
>;

export type ITsnQuantitativeMeasurement = z.infer<
  typeof TsnQuantitativeMeasurementSchema
>;

export type ITsnQualitativeMeasurementOption = z.infer<
  typeof TsnQualitativeMeasurementOptionSchema
>;

export type ITsnMeasurements = z.infer<typeof TsnMeasurementsSchema>;

export type ICollectionCategoryDef = Omit<
  lk_collection_category,
  AuditColumns
> & { itis_tsn: number };

export type ICollectionUnitDef = Omit<xref_collection_unit, AuditColumns>;

export const CollectionUnitCategorySchema = z.object({
  category_name: z.string(),
  taxon_name_latin: z.string().optional(),
  taxon_name_common: z.string().optional(),
});

export const CollectionUnitCategoryIdSchema = z
  .object({
    category_id: z.string().uuid().optional(),
  })
  .passthrough();
