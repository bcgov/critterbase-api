import { prisma } from "../../utils/constants";
import { marking, frequency_unit, Prisma } from "@prisma/client";
import { exclude, isValidObject } from "../../utils/helper_functions";
import { date, number, string, z } from "zod";
import { nonEmpty } from "../../utils/zod_schemas";

// Types
type MarkingExcludes =
  | keyof marking
  | "critter"
  | "xref_taxon_marking_body_location"
  | "lk_marking_type"
  | "lk_marking_material";

const excludes: MarkingExcludes[] = [
  "xref_taxon_marking_body_location",
  "lk_marking_material",
  "lk_marking_type",
];

// Prisma objects
const subSelects = {
  include: {
    critter: {
      select: {
        wlh_id: true,
        animal_id: true,
        lk_taxon: {
          select: { taxon_name_common: true },
        },
      },
    },
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

/**
 * * Returns all existing markings from the database
 */
const getAllMarkings = async (): Promise<marking[]> => {
  return await prisma.marking.findMany();
};

/**
 * * Gets a marking by the marking_id
 * * Returns null if non-existent
 * TODO: Add type for marking with included subselects
 * @param {string} marking_id
 */
const getMarkingById = async (marking_id: string): Promise<any | null> => {
  const marking = await prisma.marking.findUnique({
    where: {
      marking_id: marking_id,
    },
    // ...subSelects,
  });
  // return marking && exclude(marking, excludes);
  return marking;
};

/**
 * * Gets all markings that reference a critter_id
 * @param {string} marking_id
 */
const getMarkingsByCritterId = async (
  critter_id: string
): Promise<marking[]> => {
  return await prisma.marking.findMany({
    where: {
      critter_id: critter_id,
    },
  });
};

/**
 * * Updates a marking in the database
 * @param {string} marking_id
 * @param {Prisma.markingUncheckedUpdateInput} marking_data
 */
const updateMarking = async (
  marking_id: string,
  marking_data: Prisma.markingUncheckedUpdateInput
): Promise<marking> => {
  return await prisma.marking.update({
    where: {
      marking_id: marking_id,
    },
    data: marking_data,
  });
};

/**
 * * Creates a new marking in the database
 * * Valid reference to existing critter_id and taxon_marking_body_location_id UUIDs must be provided
 * @param {Prisma.markingUncheckedCreateInput} marking_data
 */
const createMarking = async (
  marking_data: Prisma.markingUncheckedCreateInput
): Promise<marking> => {
  return await prisma.marking.create({ data: marking_data });
};

/**
 * * Removes a marking from the database
 * @param {string} marking_id
 */
const deleteMarking = async (marking_id: string): Promise<marking> => {
  return await prisma.marking.delete({
    where: {
      marking_id: marking_id,
    },
  });
};

// Zod schema to validate create user data
const CreateMarkingSchema = z.object({
  critter_id: string().uuid(),
  capture_id: string().uuid().optional(),
  mortality_id: string().uuid().optional(),
  taxon_marking_body_location_id: string().uuid(),
  marking_type_id: string().uuid().optional(),
  marking_material_id: string().uuid().optional(),
  primary_colour_id: string().uuid().optional(),
  secondary_colour_id: string().uuid().optional(),
  text_colour_id: string().uuid().optional(),
  identifier: string().optional(),
  frequency: number().optional(),
  frequency_unit: z
    .union([
      // Inline Zod schema for frequency_unit
      z.literal(frequency_unit.Hz),
      z.literal(frequency_unit.KHz),
      z.literal(frequency_unit.MHz),
    ])
    .optional(),
  order: number().optional(),
  comment: string().optional(),
  attached_timestamp: z.coerce.date().optional(),
  removed_timestamp: z.coerce.date().optional(),
});

// Zod schema to validate update user data
const UpdateMarkingSchema = CreateMarkingSchema.partial().refine(
  nonEmpty,
  "no new data was provided or the format was invalid"
);

export {
  getAllMarkings,
  getMarkingById,
  getMarkingsByCritterId,
  updateMarking,
  createMarking,
  deleteMarking,
  CreateMarkingSchema,
  UpdateMarkingSchema,
};
