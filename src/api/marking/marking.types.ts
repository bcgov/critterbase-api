import { frequency_unit, marking } from "@prisma/client";
import { z } from "zod";
import { nonEmpty } from "../../utils/zod_schemas";

// Types
type MarkingLks = Pick<
  marking,
  | "taxon_marking_body_location_id"
  | "marking_material_id"
  | "marking_type_id"
  | "primary_colour_id"
  | "secondary_colour_id"
  | "text_colour_id"
>;
type MarkingExcludes =
  | keyof MarkingLks
  | "xref_taxon_marking_body_location"
  | "lk_marking_type"
  | "lk_marking_material";

type MarkingResponseBody = Omit<
  marking & {
    lk_marking_material: {
      material: string | null;
    } | null;
    lk_marking_type: {
      name: string;
    } | null;
    xref_taxon_marking_body_location: {
      body_location: string;
    };
    lk_colour_marking_primary_colour_idTolk_colour: {
      colour: string;
    } | null;
    lk_colour_marking_secondary_colour_idTolk_colour: {
      colour: string;
    } | null;
    lk_colour_marking_text_colour_idTolk_colour: {
      colour: string;
    } | null;
  },
  MarkingExcludes
> | null;

// Keys to be excluded from reponse body
const markingExcludes: MarkingExcludes[] = [
  "xref_taxon_marking_body_location",
  "taxon_marking_body_location_id",
  "lk_marking_material",
  "marking_material_id",
  "lk_marking_type",
  "marking_type_id",
  "primary_colour_id",
  "secondary_colour_id",
  "text_colour_id",
];

// Included Data from foreign keys
const markingIncludes = {
  include: {
    // critter: {
    //   select: {
    //     wlh_id: true,
    //     animal_id: true,
    //     lk_taxon: {
    //       select: { taxon_name_common: true },
    //     },
    //   },
    // },
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
  },
};

// Zod schema to validate create user data
const MarkingCreateBodySchema = z.object({
  critter_id: z.string().uuid(),
  capture_id: z.string().uuid().optional(),
  mortality_id: z.string().uuid().optional(),
  taxon_marking_body_location_id: z.string().uuid(),
  marking_type_id: z.string().uuid().optional(),
  marking_material_id: z.string().uuid().optional(),
  primary_colour_id: z.string().uuid().optional(),
  secondary_colour_id: z.string().uuid().optional(),
  text_colour_id: z.string().uuid().optional(),
  identifier: z.string().optional(),
  frequency: z.number().optional(),
  frequency_unit: z
    .union([
      // Inline Zod schema for frequency_unit
      z.literal(frequency_unit.Hz),
      z.literal(frequency_unit.KHz),
      z.literal(frequency_unit.MHz),
    ])
    .optional(),
  order: z.number().optional(),
  comment: z.string().optional(),
  attached_timestamp: z.coerce.date().optional(),
  removed_timestamp: z.coerce.date().optional(),
});

// Zod schema to validate update user data
const MarkingUpdateBodySchema = MarkingCreateBodySchema.partial().refine(
  nonEmpty,
  "no new data was provided or the format was invalid"
);

type MarkingCreateInput = z.infer<typeof MarkingCreateBodySchema>;
type MarkingUpdateInput = z.infer<typeof MarkingUpdateBodySchema>;

export {
  MarkingCreateBodySchema,
  MarkingUpdateBodySchema,
  markingIncludes,
  markingExcludes,
};
export type {
  MarkingCreateInput,
  MarkingUpdateInput,
  MarkingExcludes,
  MarkingResponseBody,
};
