import {
  measurement_unit,
  xref_collection_unit,
  xref_taxon_marking_body_location,
  xref_taxon_measurement_qualitative,
  xref_taxon_measurement_qualitative_option,
  xref_taxon_measurement_quantitative
} from '@prisma/client';
import { z } from 'zod';
import { AuditColumns } from '../utils/types';
import { implement, zodID } from '../utils/zod_helpers';

/**
 * @table xref_taxon_marking_body_location
 *
 */
export const TsnMarkingBodyLocationSchema = implement<Omit<xref_taxon_marking_body_location, AuditColumns>>().with({
  taxon_marking_body_location_id: zodID,
  itis_tsn: z.number(),
  body_location: z.string(),
  description: z.string().nullable()
});

/**
 * @table xref_taxon_measurement_qualitative_option
 *
 */
const TsnQualitativeMeasurementOptionSchema = implement<
  Omit<xref_taxon_measurement_qualitative_option, AuditColumns>
>().with({
  qualitative_option_id: zodID,
  taxon_measurement_id: zodID,
  option_label: z.string().nullable(),
  option_value: z.number(),
  option_desc: z.string().nullable()
});

/**
 * @table xref_taxon_measurement_qualitative + xref_taxon_measurement_qualitative_option
 *
 */
export const TsnQualitativeMeasurementSchema = implement<
  Omit<xref_taxon_measurement_qualitative, AuditColumns> & {
    options: Omit<ITsnQualitativeMeasurementOption, 'taxon_measurement_id'>[];
  }
>().with({
  taxon_measurement_id: zodID,
  itis_tsn: z.number(),
  measurement_name: z.string(),
  measurement_desc: z.string().nullable(),
  options: z.array(
    TsnQualitativeMeasurementOptionSchema.omit({
      taxon_measurement_id: true
    }).strict()
  )
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
  min_value: z.number().nullable(),
  max_value: z.number().nullable(),
  unit: z.nativeEnum(measurement_unit).nullable()
});

/**
 * @table xref_collection_unit
 *
 */
export const CollectionUnitSchema = implement<Omit<xref_collection_unit, AuditColumns>>().with({
  collection_unit_id: zodID,
  collection_category_id: zodID,
  unit_name: z.string(),
  description: z.string().nullable()
});

export const CollectionUnitWithCategorySchema = CollectionUnitSchema.extend({ category_name: z.string() });

export const CollectionCategorySchema = z.object({
  collection_category_id: zodID,
  category_name: z.string(),
  description: z.string().nullable(),
  itis_tsn: z.number()
});

export const TsnMeasurementsSchema = z.object({
  qualitative: TsnQualitativeMeasurementSchema.array(),
  quantitative: TsnQuantitativeMeasurementSchema.array()
});

export const MeasurementSearchQuery = z.object({
  name: z.string(),
  tsns: z.preprocess((val) => {
    if (Array.isArray(val)) {
      return val.map(Number);
    }
    return val;
  }, z.array(z.number()).optional())
});

/**
 * Types from zod schemas.
 *
 */

export type IMeasurementWithTsnHierarchy = z.infer<typeof TsnMeasurementsSchema>;

export type IMeasurementSearch = z.infer<typeof MeasurementSearchQuery>;

export type ITsnMarkingBodyLocation = z.infer<typeof TsnMarkingBodyLocationSchema>;

export type ITsnQualitativeMeasurement = z.infer<typeof TsnQualitativeMeasurementSchema>;

export type ITsnQuantitativeMeasurement = z.infer<typeof TsnQuantitativeMeasurementSchema>;

export type ITsnQualitativeMeasurementOption = z.infer<typeof TsnQualitativeMeasurementOptionSchema>;

export type ITsnMeasurements = z.infer<typeof TsnMeasurementsSchema>;

export type ICollectionCategory = z.infer<typeof CollectionCategorySchema>;

export type ICollectionUnit = z.infer<typeof CollectionUnitSchema>;

export type ICollectionUnitWithCategory = z.infer<typeof CollectionUnitWithCategorySchema>;

export const CollectionUnitCategoryQuerySchema = z.object({
  category_name: z.string(),
  itis_scientific_name: z.string().optional()
});

export const CollectionUnitTaxonQuerySchema = z.object({
  tsn: z.coerce.number()
});

export const CollectionUnitCategoryIdSchema = z.object({
  category_id: z.string().uuid()
});

export const MeasurementIdsQuerySchema = z.object({
  taxon_measurement_ids: z.string().uuid().array()
});

export type TSNWithHierarchy = {
  tsn: number;
  hierarchy: number[];
};
