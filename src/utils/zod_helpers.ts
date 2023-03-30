import {
  critter,
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit,
  measurement_unit,
  xref_taxon_measurement_qualitative,
  xref_taxon_measurement_qualitative_option,
  xref_taxon_measurement_quantitative,
} from ".prisma/client";
import { z } from "zod";
import { IS_DEV } from "./constants";
import { AuditColumns, Implements } from "./types";
// Schemas
const zodID = z.string().uuid();

const zodAudit = {
  create_user: z.string(),
  update_user: z.string(),
  create_timestamp: z.date(),
  update_timestamp: z.date(),
};

const uuidParamsSchema = z.object({
  id: z.string().uuid("query param is an invalid UUID"),
});

const critterIDQuerySchema = z.object({
  critter_id: zodID,
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
      }
    >(
      schema: Schema
    ) => z.object(schema),
  };
}

export {
  uuidParamsSchema,
  critterIDQuerySchema,
  nonEmpty,
  noAudit,
  zodID,
  LookupWmuSchema,
  LookupRegionEnvSchema,
  LookupRegionNrSchema,
  zodAudit,
  XrefTaxonMeasurementQuantitativeSchema,
  XrefTaxonMeasurementQualitativeSchema,
  XrefTaxonMeasurementQualitativeOptionSchema,
};
