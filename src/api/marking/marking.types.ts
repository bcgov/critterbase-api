import { frequency_unit, marking, Prisma } from "@prisma/client";
import { z } from "zod";
import { getAuditColumns } from "../../utils/helper_functions";
import { AuditColumns } from "../../utils/types";
import { nonEmpty } from "../../utils/zod_schemas";

// Types
type MarkingIncludes = Prisma.markingGetPayload<typeof markingIncludes>;

type SimpleFormattedMarking = {
  primary_colour: string | null;
  secondary_colour: string | null;
  marking_type: string | null;
  marking_material: string | null;
  body_location: string | null;
  identifier: string | null;
  frequency: number | null;
  frequency_unit: frequency_unit | null;
  order: number | null;
};

interface FormattedMarking extends SimpleFormattedMarking, AuditColumns {
  marking_id: string;
  critter_id: string;
  capture_id: string | null;
  mortality_id: string | null;
  text_colour: string | null;
  comment: string | null;
  attached_timestamp: Date;
  removed_timestamp: Date | null;
}

type MarkingCreateInput = z.infer<typeof MarkingCreateBodySchema>;
type MarkingUpdateInput = z.infer<typeof MarkingUpdateBodySchema>;

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

// Validate incoming request body for create marking
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
}) satisfies z.ZodType<Prisma.markingUncheckedCreateInput>;

// Validate incoming request body for update marking
const MarkingUpdateBodySchema = MarkingCreateBodySchema.partial().refine(
  nonEmpty,
  "no new data was provided or the format was invalid"
) satisfies z.ZodType<Prisma.markingUpdateInput>;

// Utility Functions

/**
 * * Deconstructs values from lookup tables into main body
 * * Leaves out lk foreign keys and audit columns
 * @param {MarkingIncludes} marking
 */
const formatMarking = (marking: MarkingIncludes): FormattedMarking => ({
  marking_id: marking.marking_id,
  critter_id: marking.critter_id,
  capture_id: marking.capture_id,
  mortality_id: marking.mortality_id,
  primary_colour:
    marking.lk_colour_marking_primary_colour_idTolk_colour?.colour ?? null,
  secondary_colour:
    marking.lk_colour_marking_secondary_colour_idTolk_colour?.colour ?? null,
  text_colour:
    marking.lk_colour_marking_text_colour_idTolk_colour?.colour ?? null,
  marking_type: marking.lk_marking_type?.name ?? null,
  marking_material: marking.lk_marking_material?.material ?? null,
  body_location:
    marking.xref_taxon_marking_body_location?.body_location ?? null,
  identifier: marking.identifier,
  frequency: marking.frequency,
  frequency_unit: marking.frequency_unit,
  order: marking.order,
  comment: marking.comment,
  attached_timestamp: marking.attached_timestamp,
  removed_timestamp: marking.removed_timestamp,
  ...getAuditColumns(marking),
});

export {
  MarkingCreateBodySchema,
  MarkingUpdateBodySchema,
  markingIncludes,
  formatMarking,
};
export type {
  MarkingCreateInput,
  MarkingUpdateInput,
  MarkingIncludes,
  FormattedMarking,
};
