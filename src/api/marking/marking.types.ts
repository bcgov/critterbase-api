import { frequency_unit, marking, Prisma } from "@prisma/client";
import { z } from "zod";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  LookUpColourSchema,
  LookUpMarkingTypeSchema,
  LookUpMaterialSchema,
  noAudit,
  nonEmpty,
  XrefTaxonMarkingBodyLocationSchema,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";

// Types
type MarkingIncludes = Prisma.markingGetPayload<typeof markingIncludes>;

type MarkingCreateInput = z.infer<typeof MarkingCreateBodySchema>;

type MarkingUpdateInput = z.infer<typeof MarkingUpdateBodySchema>;

type MarkingResponseSchema = z.TypeOf<typeof markingResponseSchema>;

// Constants

// Included related data from lk and xref tables
const markingIncludes = {
  include: {
    xref_taxon_marking_body_location: {
      select: { body_location: true },
    },
    lk_marking_type: {
      select: { name: true },
    },
    lk_marking_material: {
      select: { material: true },
    },
    lk_colour_marking_primary_colour_idTolk_colour: {
      select: { colour: true },
    },
    lk_colour_marking_secondary_colour_idTolk_colour: {
      select: { colour: true },
    },
    lk_colour_marking_text_colour_idTolk_colour: {
      select: { colour: true },
    },
  } satisfies Prisma.markingInclude,
};

// Schemas

// Base schema for all marking related data
const markingSchema = implement<marking>().with({
  marking_id: zodID,
  critter_id: zodID,
  capture_id: zodID.nullable(),
  mortality_id: zodID.nullable(),
  taxon_marking_body_location_id: zodID,
  marking_type_id: zodID.nullable(),
  marking_material_id: zodID.nullable(),
  primary_colour_id: zodID.nullable(),
  secondary_colour_id: zodID.nullable(),
  text_colour_id: zodID.nullable(),
  identifier: z.string().nullable(),
  frequency: z.number().nullable(),
  frequency_unit: z.nativeEnum(frequency_unit).nullable(),
  order: z.number().int().nullable(),
  comment: z.string().nullable(),
  attached_timestamp: z.coerce.date(),
  removed_timestamp: z.coerce.date().nullable(),
  ...zodAudit,
});

// Extended schema which has both base schema and included fields
const markingIncludesSchema = implement<MarkingIncludes>().with({
  ...markingSchema.shape,
  lk_colour_marking_primary_colour_idTolk_colour: LookUpColourSchema.pick({
    colour: true,
  }).nullable(),
  lk_colour_marking_secondary_colour_idTolk_colour: LookUpColourSchema.pick({
    colour: true,
  }).nullable(),
  lk_colour_marking_text_colour_idTolk_colour: LookUpColourSchema.pick({
    colour: true,
  }).nullable(),
  lk_marking_type: LookUpMarkingTypeSchema.pick({
    name: true,
  }).nullable(),
  lk_marking_material: LookUpMaterialSchema.pick({
    material: true,
  }).nullable(),
  xref_taxon_marking_body_location: XrefTaxonMarkingBodyLocationSchema.pick({
    body_location: true,
  }),
});

// Formatted API reponse schema which omits fields and unpacks nested data
const markingResponseSchema = markingIncludesSchema
  .omit({
    primary_colour_id: true,
    secondary_colour_id: true,
    text_colour_id: true,
    marking_type_id: true,
    marking_material_id: true,
    taxon_marking_body_location_id: true,
  })
  .transform((val) => {
    const {
      lk_colour_marking_primary_colour_idTolk_colour,
      lk_colour_marking_secondary_colour_idTolk_colour,
      lk_colour_marking_text_colour_idTolk_colour,
      lk_marking_material,
      lk_marking_type,
      xref_taxon_marking_body_location,
      ...rest
    } = val;
    return {
      primary_colour:
        lk_colour_marking_primary_colour_idTolk_colour?.colour ?? null,
      secondary_colour:
        lk_colour_marking_secondary_colour_idTolk_colour?.colour ?? null,
      text_colour: lk_colour_marking_text_colour_idTolk_colour?.colour ?? null,
      marking_type: lk_marking_type?.name ?? null,
      marking_material: lk_marking_material?.material ?? null,
      body_location: xref_taxon_marking_body_location?.body_location ?? null,
      ...rest,
    };
  });

// Validate incoming request body for create marking
const MarkingCreateBodySchema = implement<
  Omit<Prisma.markingUncheckedCreateInput, "marking_id" | keyof AuditColumns>
>().with(
  markingSchema
    .omit({ ...noAudit, marking_id: true })
    .partial()
    .required({ critter_id: true, taxon_marking_body_location_id: true }).shape
);

// Validate incoming request body for update marking
const MarkingUpdateBodySchema = implement<
  Omit<Prisma.markingUncheckedUpdateInput, "marking_id" | keyof AuditColumns>
>()
  .with(MarkingCreateBodySchema.partial().shape)
  .refine(nonEmpty, "no new data was provided or the format was invalid");

export {
  MarkingCreateBodySchema,
  MarkingUpdateBodySchema,
  markingResponseSchema,
  markingIncludes,
};
export type {
  MarkingCreateInput,
  MarkingUpdateInput,
  MarkingIncludes,
  MarkingResponseSchema,
};
