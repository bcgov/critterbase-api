/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  frequency_unit,
  marking,
  Prisma,
  xref_taxon_marking_body_location,
} from "@prisma/client";
import { z, ZodString } from "zod";
import { prisma } from "../../utils/constants";
import {
  implement,
  LookUpColourSchema,
  LookUpMarkingTypeSchema,
  LookUpMaterialSchema,
  noAudit,
  nonEmpty,
  ResponseSchema,
  XrefTaxonMarkingBodyLocationSchema,
  zodAudit,
  zodID,
} from "../../utils/zod_helpers";
import { AuditColumns } from "../../utils/types";
// Types
type MarkingIncludes = Prisma.markingGetPayload<typeof markingIncludes>;

type MarkingCreateInput = z.infer<typeof MarkingCreateBodySchema>;

type MarkingUpdateInput = z.infer<typeof MarkingUpdateBodySchema>;

type FormattedMarking = z.infer<typeof markingResponseSchema>;

type IMarkingLookup = Pick<
  xref_taxon_marking_body_location,
  "body_location"
> & { primary_colour: string; secondary_colour: string };

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
  identifier: z
    .union([z.string(), z.number(), z.null()])
    .refine((value) => typeof value !== "undefined", {
      message: "Value is undefined",
    })
    .transform((value) => String(value)) as unknown as z.ZodNullable<ZodString>,
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
const markingResponseSchema = ResponseSchema.transform((obj) => {
  const {
    //omit
    /*primary_colour_id,
    secondary_colour_id,
    text_colour_id,
    marking_type_id,
    marking_material_id,
    taxon_marking_body_location_id,*/
    //include
    xref_taxon_marking_body_location,
    lk_marking_type,
    lk_marking_material,
    lk_colour_marking_primary_colour_idTolk_colour,
    lk_colour_marking_secondary_colour_idTolk_colour,
    lk_colour_marking_text_colour_idTolk_colour,
    ...rest
  } = obj as MarkingIncludes;
  return {
    ...rest,
    body_location: xref_taxon_marking_body_location?.body_location ?? null,
    marking_type: lk_marking_type?.name ?? null,
    marking_material: lk_marking_material?.material ?? null,
    primary_colour:
      lk_colour_marking_primary_colour_idTolk_colour?.colour ?? null,
    secondary_colour:
      lk_colour_marking_secondary_colour_idTolk_colour?.colour ?? null,
    text_colour: lk_colour_marking_text_colour_idTolk_colour?.colour ?? null,
  };
});

//Validate incoming request body for create marking
const MarkingCreateBodySchema = implement<
  Omit<Prisma.markingCreateManyInput, "marking_id" | keyof AuditColumns>
>().with(
  markingSchema
    .omit({ ...noAudit, marking_id: true })
    .partial()
    .required({ critter_id: true, taxon_marking_body_location_id: true }).shape
);
/*const MarkingCreateBodySchema = markingSchema
  .extend({
    primary_colour: z.string().optional(),
    secondary_colour: z.string().optional(),
    body_location: z.string().optional(),
    taxon_marking_body_location_id: zodID.optional(),
    taxon_id: zodID.optional()
  })
  .partial()
  .omit({ ...noAudit, marking_id: true })
  .transform(async (v): Promise<Omit<marking, "marking_id">> => {
    const { primary_colour, secondary_colour, body_location } = v;
    const taxon_id = v.taxon_id ?? (await prisma.critter.findFirstOrThrow({
      where: { critter_id: v.critter_id },
    })).taxon_id;
    if (primary_colour) {
      const col = await getColourByName(primary_colour);
      v.primary_colour_id = col?.colour_id;
    }
    if (secondary_colour) {
      const col = await getColourByName(secondary_colour);
      v.secondary_colour_id = col?.colour_id;
    }
    if (body_location) {
      const taxon_uuid = taxon_id;
      const loc = await getBodyLocationByNameAndTaxonUUID(
        body_location,
        taxon_uuid
      );
      v.taxon_marking_body_location_id = loc?.taxon_marking_body_location_id;
    }
    return v as marking;
  });*/

// Validate incoming request body for update marking
const MarkingUpdateBodySchema = MarkingCreateBodySchema.refine(
  nonEmpty,
  "no new data was provided or the format was invalid"
);

const MarkingCreateWithEnglishSchema = z
  .object({
    primary_colour: z.string().optional(),
    secondary_colour: z.string().optional(),
    body_location: z.string().optional(),
  })
  .passthrough();

export {
  MarkingCreateBodySchema,
  MarkingUpdateBodySchema,
  markingResponseSchema,
  markingIncludes,
  markingIncludesSchema,
  MarkingCreateWithEnglishSchema,
};
export type { MarkingCreateInput, MarkingUpdateInput, MarkingIncludes, FormattedMarking };
