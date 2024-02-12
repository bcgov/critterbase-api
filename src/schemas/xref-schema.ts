import {
  lk_collection_category,
  xref_collection_unit,
  xref_taxon_marking_body_location,
  xref_taxon_measurement_qualitative,
  xref_taxon_measurement_qualitative_option,
  xref_taxon_measurement_quantitative,
} from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../utils/types";

/**
 *
 * Xref schemas and types
 *
 */

export type IMarkingBodyLocationDef = Omit<
  xref_taxon_marking_body_location,
  AuditColumns
>;

export type IQualitativeMeasurementDef = Omit<
  xref_taxon_measurement_qualitative,
  AuditColumns
>;

export type IQualitativeMeasurementOption = Omit<
  xref_taxon_measurement_qualitative_option,
  AuditColumns
>;

export type IQuantitativeMeasurementDef = Omit<
  xref_taxon_measurement_quantitative,
  AuditColumns
>;

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
    category_id: z.string().optional(),
  })
  .passthrough();
