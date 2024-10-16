import {
  lk_cause_of_death,
  lk_collection_category,
  lk_colour,
  lk_marking_material,
  lk_marking_type,
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
  xref_collection_unit,
  xref_taxon_marking_body_location
} from '@prisma/client';
import { z } from 'zod';
import { AuditColumns, Implements, QueryFormats } from './types';

// Schemas
const zodID = z.string().uuid();

const zodTime = z.preprocess((time) => new Date(`1970-01-01 ${time as string}`), z.date());

const zodAudit = {
  create_user: z.string().uuid(),
  update_user: z.string().uuid(),
  create_timestamp: z.coerce.date(),
  update_timestamp: z.coerce.date()
};

const DeleteSchema = z.object({ _delete: z.boolean() });

const QueryFormatSchema = z.object({
  format: z.nativeEnum(QueryFormats).catch(QueryFormats.default)
});

const NumberToString = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === 'number' ? String(val) : val)) as unknown as z.ZodString;

const ResponseSchema = z.object({}).passthrough();

const uuidParamsSchema = z.object({
  id: z.string().uuid('query param is an invalid UUID')
});

const tsnQuerySchema = z.object({
  tsn: z.preprocess((val) => Number(val), z.number())
});

const LookupWmuSchema = implement<lk_wildlife_management_unit>().with({
  wmu_id: zodID,
  wmu_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit
});

const LookupRegionNrSchema = implement<lk_region_nr>().with({
  region_nr_id: zodID,
  region_nr_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit
});

const LookupRegionEnvSchema = implement<lk_region_env>().with({
  region_env_id: zodID,
  region_env_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit
});

const nonEmpty = (obj: Record<string | number | symbol, unknown>) => Object.values(obj).some((v) => v !== undefined);

const noAudit: Record<AuditColumns, true> = {
  create_user: true,
  update_user: true,
  create_timestamp: true,
  update_timestamp: true
};

/**
 * Implements a zod schema from an existing type.
 * Throws a type warning if the underlying zod schema is not the correct type.
 *
 * @template Model - Generic type to enforce
 * @returns {Model}
 */
export function implement<Model = never>() {
  return {
    with: <
      Schema extends Implements<Model> & {
        [unknownKey in Exclude<keyof Schema, keyof Model>]: never;
      }
    >(
      schema: Schema
    ) => z.object(schema)
  };
}

const LookUpColourSchema = implement<lk_colour>().with({
  colour_id: z.string().uuid(),
  colour: z.string(),
  hex_code: z.string().nullable(),
  description: z.string().nullable(),
  ...zodAudit
});

const LookUpMarkingTypeSchema = implement<lk_marking_type>().with({
  marking_type_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  ...zodAudit
});

const LookUpMaterialSchema = implement<lk_marking_material>().with({
  marking_material_id: z.string().uuid(),
  material: z.string().nullable(),
  description: z.string().nullable(),
  ...zodAudit
});

const LookupCollectionUnitCategorySchema = implement<lk_collection_category>().with({
  collection_category_id: zodID,
  category_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit
});

const LookupCodSchema = implement<lk_cause_of_death>().with({
  cod_id: zodID,
  cod_category: z.string(),
  cod_reason: z.string().nullable(),
  ...zodAudit
});

const XrefTaxonMarkingBodyLocationSchema = implement<xref_taxon_marking_body_location>().with({
  taxon_marking_body_location_id: z.string().uuid(),
  itis_tsn: z.number(),
  body_location: z.string(),
  description: z.string().nullable(),
  ...zodAudit
});

const XrefCollectionUnitSchema = implement<xref_collection_unit>().with({
  collection_unit_id: z.string().uuid(),
  collection_category_id: z.string().uuid(),
  unit_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit
});

const XrefTaxonCollectionCategorySchema = implement<xref_collection_unit>().with({
  collection_unit_id: zodID,
  collection_category_id: zodID,
  unit_name: z.string(),
  description: z.string().nullable(),
  ...zodAudit
});

type IResponseSchema = z.ZodPipeline<z.ZodTypeAny, z.ZodTypeAny> | z.ZodTypeAny;
export type { IResponseSchema };

export {
  DeleteSchema,
  LookUpColourSchema,
  LookUpMarkingTypeSchema,
  LookUpMaterialSchema,
  LookupCodSchema,
  LookupCollectionUnitCategorySchema,
  LookupRegionEnvSchema,
  LookupRegionNrSchema,
  LookupWmuSchema,
  NumberToString,
  QueryFormatSchema,
  ResponseSchema,
  XrefCollectionUnitSchema,
  XrefTaxonCollectionCategorySchema,
  XrefTaxonMarkingBodyLocationSchema,
  noAudit,
  nonEmpty,
  tsnQuerySchema,
  uuidParamsSchema,
  zodAudit,
  zodID,
  zodTime
};
