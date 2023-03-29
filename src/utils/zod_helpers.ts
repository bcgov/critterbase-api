import {
  critter,
  lk_region_env,
  lk_region_nr,
  lk_wildlife_management_unit, 
  lk_colour, 
  lk_marking_material, 
  lk_marking_type
} from ".prisma/client";
import { z } from "zod";
import { AuditColumns, Implements } from "./types";
// Schemas
const zodID = z.string().uuid();

const zodAudit = {
  create_user: z.string().uuid(),
  update_user: z.string().uuid(),
  create_timestamp: z.date(),
  update_timestamp: z.date(),
};

const uuidParamsSchema = z.object({
  id: z.string().uuid("query param is an invalid UUID"),
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
  ...zodAudit
})

const LookUpMaterialSchema = implement<lk_marking_material>().with({
  marking_material_id: z.string().uuid(),
  material: z.string().nullable(),
  description: z.string().nullable(),
  ...zodAudit,
});

const XrefTaxonMarkingBodyLocationSchema = z.object({
  taxon_marking_body_location_id: z.string().uuid(),
  taxon_id: z.string().uuid(),
  body_location: z.string(),
  description: z.string().nullish(),
  create_user: z.string().uuid().nullish(),
  update_user: z.string().uuid().nullish(),
  create_timestamp: z.date().nullish(),
  update_timestamp: z.date().nullish(),
})

export {
  uuidParamsSchema,
  nonEmpty,
  noAudit,
  zodID,
  zodAudit,
  LookUpColourSchema,
  LookUpMarkingTypeSchema,
  LookUpMaterialSchema,
  XrefTaxonMarkingBodyLocationSchema,
  LookupWmuSchema,
  LookupRegionEnvSchema,
  LookupRegionNrSchema,
};
