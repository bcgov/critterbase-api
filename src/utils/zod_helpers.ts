import {
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
  xref_collection_unit,
  measurement_unit,
  xref_taxon_measurement_qualitative,
  xref_taxon_measurement_qualitative_option,
  xref_taxon_measurement_quantitative,
  lk_colour,
  lk_marking_material,
  lk_marking_type,
  xref_taxon_marking_body_location,
  lk_collection_category,
  lk_cause_of_death,
  lk_taxon,
} from "@prisma/client";
import { z } from "zod";
import { AuditColumns, Implements, QueryFormats } from "./types";

// Schemas
const zodID = z.string().uuid();

const zodAudit = {
  create_user: z.string().uuid(),
  update_user: z.string().uuid(),
  create_timestamp: z.coerce.date(),
  update_timestamp: z.coerce.date(),
};

const DeleteSchema = z.object({ _delete: z.boolean() });

const QueryFormatSchema = z.object({
  format: z.nativeEnum(QueryFormats).catch(QueryFormats.default),
});

const NumberToString = z
  .union([z.string(), z.number()])
  .transform((val) =>
    typeof val === "number" ? String(val) : val,
  ) as unknown as z.ZodString;

const ResponseSchema = z.object({}).passthrough();

const uuidParamsSchema = z.object({
  id: z.string().uuid("query param is an invalid UUID"),
});

const critterIdSchema = z.object({
  critter_id: zodID,
});

const taxonIdSchema = z.object({
  taxon_id: zodID.optional(),
});

const tsnQuerySchema = z.object({
  tsn: z.preprocess((val) => Number(val), z.number()),
});

const taxonMeasurementIdSchema = z.object({
  taxon_measurement_id: zodID,
});

const LookupWmuSchema = implement<lk_wildlife_management_unit>().with({
  wmu_id: zodID,
  wmu_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit,
});

const LookupRegionNrSchema = implement<lk_region_nr>().with({
  region_nr_id: zodID,
  region_nr_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit,
});

const LookupRegionEnvSchema = implement<lk_region_env>().with({
  region_env_id: zodID,
  region_env_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit,
});

const XrefTaxonMeasurementQuantitativeSchema =
  implement<xref_taxon_measurement_quantitative>().with({
    taxon_measurement_id: zodID,
    taxon_id: zodID,
    measurement_name: z.string(),
    measurement_desc: z.string().nullable(),
    min_value: z.number().nullable(),
    max_value: z.number().nullable(),
    unit: z.nativeEnum(measurement_unit).nullable(),
    ...zodAudit,
  });

const XrefTaxonMeasurementQualitativeSchema =
  implement<xref_taxon_measurement_qualitative>().with({
    taxon_measurement_id: zodID,
    taxon_id: zodID,
    measurement_name: z.string(),
    measurement_desc: z.string().nullable(),
    ...zodAudit,
  });

const XrefTaxonMeasurementQualitativeOptionSchema =
  implement<xref_taxon_measurement_qualitative_option>().with({
    qualitative_option_id: z.string(),
    taxon_measurement_id: zodID,
    option_label: z.string(),
    option_value: z.number(),
    option_desc: z.string().nullable(),
    ...zodAudit,
  });

const nonEmpty = (obj: Record<string | number | symbol, unknown>) =>
  Object.values(obj).some((v) => v !== undefined);

const noAudit: Record<keyof AuditColumns, true> = {
  create_user: true,
  update_user: true,
  create_timestamp: true,
  update_timestamp: true,
};

export function implement<Model = never>() {
  return {
    with: <
      Schema extends Implements<Model> & {
        [unknownKey in Exclude<keyof Schema, keyof Model>]: never;
      },
    >(
      schema: Schema,
    ) => z.object(schema),
  };
}

const LookupTaxonSchema = implement<lk_taxon>().with({
  taxon_id: zodID,
  kingdom_id: zodID.nullable(),
  phylum_id: zodID.nullable(),
  class_id: zodID.nullable(),
  order_id: zodID.nullable(),
  family_id: zodID.nullable(),
  genus_id: zodID.nullable(),
  species_id: zodID.nullable(),
  sub_species_id: zodID.nullable(),
  spi_taxonomy_id: z.number(),
  taxon_description: z.string().nullable(),
  taxon_name_common: z.string().nullable(),
  taxon_name_latin: z.string(),
  ...zodAudit,
});

const LookUpColourSchema = implement<lk_colour>().with({
  colour_id: z.string().uuid(),
  colour: z.string(),
  hex_code: z.string().nullable(),
  description: z.string().nullable(),
  ...zodAudit,
});

const LookUpMarkingTypeSchema = implement<lk_marking_type>().with({
  marking_type_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  ...zodAudit,
});

const LookUpMaterialSchema = implement<lk_marking_material>().with({
  marking_material_id: z.string().uuid(),
  material: z.string().nullable(),
  description: z.string().nullable(),
  ...zodAudit,
});

const LookupCollectionUnitCategorySchema =
  implement<lk_collection_category>().with({
    collection_category_id: zodID,
    category_name: z.string(),
    description: z.string().nullable(),
    ...zodAudit,
  });

const LookupCodSchema = implement<lk_cause_of_death>().with({
  cod_id: zodID,
  cod_category: z.string(),
  cod_reason: z.string().nullable(),
  ...zodAudit,
});

const XrefTaxonMarkingBodyLocationSchema =
  implement<xref_taxon_marking_body_location>().with({
    taxon_marking_body_location_id: z.string().uuid(),
    taxon_id: z.string().uuid(),
    body_location: z.string(),
    description: z.string().nullable(),
    ...zodAudit,
  });

const XrefCollectionUnitSchema = implement<xref_collection_unit>().with({
  collection_unit_id: z.string().uuid(),
  collection_category_id: z.string().uuid(),
  unit_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit,
});

const XrefTaxonCollectionCategorySchema =
  implement<xref_collection_unit>().with({
    collection_unit_id: zodID,
    collection_category_id: zodID,
    unit_name: z.string(),
    description: z.string().nullable(),
    ...zodAudit,
  });

//const TransformResponseSchema = ResponseSchema.transform((val) => val); //This is used as a base for a type.
type IResponseSchema = z.ZodPipeline<z.ZodTypeAny, z.ZodTypeAny> | z.ZodTypeAny;
export type { IResponseSchema };

export {
  uuidParamsSchema,
  critterIdSchema,
  nonEmpty,
  noAudit,
  zodID,
  LookUpColourSchema,
  LookUpMarkingTypeSchema,
  LookUpMaterialSchema,
  XrefTaxonMarkingBodyLocationSchema,
  XrefCollectionUnitSchema,
  LookupWmuSchema,
  LookupRegionEnvSchema,
  LookupRegionNrSchema,
  XrefTaxonMeasurementQuantitativeSchema,
  XrefTaxonMeasurementQualitativeSchema,
  XrefTaxonMeasurementQualitativeOptionSchema,
  ResponseSchema,
  zodAudit,
  NumberToString,
  QueryFormatSchema,
  taxonIdSchema,
  DeleteSchema,
  LookupCollectionUnitCategorySchema,
  LookupCodSchema,
  LookupTaxonSchema,
  XrefTaxonCollectionCategorySchema,
  taxonMeasurementIdSchema,
  tsnQuerySchema,
};
