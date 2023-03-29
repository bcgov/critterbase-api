import { frequency_unit, marking, Prisma } from "@prisma/client";
import { z } from "zod";
import { getAuditColumns } from "../../utils/helper_functions";
import { AuditColumns } from "../../utils/types";
import {
  implement,
  LookUpColourSchema,
  LookUpMarkingTypeSchema,
  LookUpMaterialSchema,
  nonEmpty,
  XrefTaxonMarkingBodyLocationSchema,
} from "../../utils/zod_helpers";

// Types
type MarkingIncludes = Prisma.markingGetPayload<typeof markingIncludes>;

type MarkingCreateInput = z.infer<typeof MarkingCreateBodySchema>;

type MarkingUpdateInput = z.infer<typeof MarkingUpdateBodySchema>;

type MarkingResponseSchema = z.TypeOf<typeof markingResponseSchema>;

// Constants
const markingSchema = implement<marking>().with({
  marking_id: z.string().uuid(),
  critter_id: z.string().uuid(),
  capture_id: z.string().uuid().nullable(),
  mortality_id: z.string().uuid().nullable(),
  taxon_marking_body_location_id: z.string().uuid(),
  marking_type_id: z.string().uuid().nullable(),
  marking_material_id: z.string().uuid().nullable(),
  primary_colour_id: z.string().uuid().nullable(),
  secondary_colour_id: z.string().uuid().nullable(),
  text_colour_id: z.string().uuid().nullable(),
  identifier: z.string().nullable(),
  frequency: z.number().nullable(),
  frequency_unit: z.nativeEnum(frequency_unit).nullable(),
  order: z.number().int().nullable(),
  comment: z.string().nullable(),
  attached_timestamp: z.date(),
  removed_timestamp: z.date().nullable(),
  create_user: z.string().uuid(),
  update_user: z.string().uuid(),
  create_timestamp: z.date(),
  update_timestamp: z.date(),
});

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
  Omit<
    Prisma.markingUncheckedCreateInput,
    | "marking_id"
    | keyof AuditColumns
  >
>().with({
  critter_id: z.string().uuid(),
  capture_id: z.string().uuid().optional().nullable(),
  mortality_id: z.string().uuid().optional().nullable(),
  taxon_marking_body_location_id: z.string().uuid(),
  marking_type_id: z.string().uuid().optional().nullable(),
  marking_material_id: z.string().uuid().optional().nullable(),
  primary_colour_id: z.string().uuid().optional().nullable(),
  secondary_colour_id: z.string().uuid().optional().nullable(),
  text_colour_id: z.string().uuid().optional().nullable(),
  identifier: z.string().optional().nullable(),
  frequency: z.number().optional().nullable(),
  frequency_unit: z.nativeEnum(frequency_unit).optional().nullable(),
  order: z.number().optional().nullable(),
  comment: z.string().optional().nullable(),
  attached_timestamp: z.coerce.date().optional(),
  removed_timestamp: z.coerce.date().optional().nullable(),
});

// Validate incoming request body for update marking
const MarkingUpdateBodySchema = MarkingCreateBodySchema.partial().refine(
  nonEmpty,
  "no new data was provided or the format was invalid"
);

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
