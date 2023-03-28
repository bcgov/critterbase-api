import { frequency_unit, marking, Prisma } from "@prisma/client";
import { z } from "zod";
import { getAuditColumns } from "../../utils/helper_functions";
import { nonEmpty } from "../../utils/zod_schemas";
import {
  Completemarking,
  lk_colourSchema,
  lk_marking_materialSchema,
  lk_marking_typeSchema,
  markingSchema,
  xref_taxon_marking_body_locationSchema,
} from "../../../prisma/zod_schemas";

type Implements<Model> = {
  [key in keyof Model]-?: undefined extends Model[key]
    ? null extends Model[key]
      ? z.ZodNullableType<z.ZodOptionalType<z.ZodType<Model[key]>>>
      : z.ZodOptionalType<z.ZodType<Model[key]>>
    : null extends Model[key]
    ? z.ZodNullableType<z.ZodType<Model[key]>>
    : z.ZodType<Model[key]>;
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

// Types
type MarkingIncludes = Prisma.markingGetPayload<typeof markingIncludes>;

type MarkingCreateInput = z.infer<typeof MarkingCreateBodySchema>;

type MarkingUpdateInput = z.infer<typeof MarkingUpdateBodySchema>;

type MarkingResponseSchema = z.TypeOf<typeof markingResponseSchema>;

// Constants
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

const markingIncludesSchema = z.object({
  lk_colour_marking_primary_colour_idTolk_colour: lk_colourSchema.pick({
    colour: true,
  }),
  lk_colour_marking_secondary_colour_idTolk_colour: lk_colourSchema.pick({
    colour: true,
  }),
  lk_colour_marking_text_colour_idTolk_colour: lk_colourSchema.pick({
    colour: true,
  }),
  lk_marking_type: lk_marking_typeSchema.pick({
    name: true,
  }),
  lk_marking_material: lk_marking_materialSchema.pick({
    material: true,
  }),
  xref_taxon_marking_body_location: xref_taxon_marking_body_locationSchema.pick(
    {
      body_location: true,
    }
  ),
});

const markingResponseSchema = markingSchema
  .and(markingIncludesSchema)
  .transform((arg) => {
    return {
      marking_id: arg.marking_id,
      critter_id: arg.critter_id,
      capture_id: arg.capture_id,
      mortality_id: arg.mortality_id,
      primary_colour:
        arg.lk_colour_marking_primary_colour_idTolk_colour?.colour ?? null,
      secondary_colour:
        arg.lk_colour_marking_secondary_colour_idTolk_colour?.colour ?? null,
      text_colour:
        arg.lk_colour_marking_text_colour_idTolk_colour?.colour ?? null,
      marking_type: arg.lk_marking_type?.name ?? null,
      marking_material: arg.lk_marking_material?.material ?? null,
      body_location:
        arg.xref_taxon_marking_body_location?.body_location ?? null,
      identifier: arg.identifier,
      frequency: arg.frequency,
      frequency_unit: arg.frequency_unit,
      order: arg.order,
      comment: arg.comment,
      attached_timestamp: arg.attached_timestamp,
      removed_timestamp: arg.removed_timestamp,
      ...getAuditColumns(arg),
    };
  });

// Validate incoming request body for create marking
const MarkingCreateBodySchema = implement<
  Omit<
    Prisma.markingUncheckedCreateInput,
    | "marking_id"
    | "create_user"
    | "update_user"
    | "create_timestamp"
    | "update_timestamp"
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

const MarkingCreateBodySchema2: z.ZodType<
  Omit<
    Prisma.markingUncheckedCreateInput,
    | "marking_id"
    | "create_user"
    | "update_user"
    | "create_timestamp"
    | "update_timestamp"
  >
> = z.object({
  critter_id: z.string().uuid(),
  capture_id: z.string().uuid().nullish(),
  mortality_id: z.string().uuid().nullish(),
  taxon_marking_body_location_id: z.string().uuid(),
  marking_type_id: z.string().uuid().nullish(),
  marking_material_id: z.string().uuid().nullish(),
  primary_colour_id: z.string().uuid().nullish(),
  secondary_colour_id: z.string().uuid().nullish(),
  text_colour_id: z.string().uuid().nullish(),
  identifier: z.string().nullish(),
  frequency: z.number().nullish(),
  frequency_unit: z.nativeEnum(frequency_unit).nullish(),
  order: z.number().nullish(),
  comment: z.string().nullish(),
  attached_timestamp: z.coerce.date().optional(),
  removed_timestamp: z.coerce.date().nullish(),
});

// Validate incoming request body for update marking
const MarkingUpdateBodySchema = z.optional(MarkingCreateBodySchema2).unwrap().refine(
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
